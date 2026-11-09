import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RedisStore } from 'connect-redis';
import { redisClient } from './config/redis.js';
import uploadRouter from './routes/upload.js';
import jobsRoutes from './routes/jobs.js';
import exportRoutes from './routes/export.js';

const app = express();
app.get('/.well-known/strix-verify.txt', (req, res) => {
  res.type('text/plain').sendFile(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../strix-verify.txt')
  );
});
const isProd = process.env.NODE_ENV === 'production';

// Render (and most PaaS hosts) terminate TLS at a reverse proxy. Without this,
// Express thinks every request is plain HTTP, so `secure` session cookies are
// never sent (=> uploads "work" but the result can never be fetched) and the
// rate limiter sees every visitor as the same IP.
app.set('trust proxy', 1);

// Allow one or more comma-separated origins, tolerating trailing slashes.
export const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map(o => o.trim().replace(/\/+$/, '')).filter(Boolean);

// Healthcheck first: must not depend on Redis, sessions or rate limits.
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', redis: redisClient.status, timestamp: new Date().toISOString() });
});

// Security headers. The CSP is relaxed only for what the client really needs:
// Iconify fetches icon JSON from its API, Google Fonts CSS/files, WebGL/blob images.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'https://api.iconify.design', 'https://api.simplesvg.com', 'https://api.unisvg.com'],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate limiting. Status polling (GET /api/upload/:id every 1.5s) is exempt,
// otherwise a single analysis could burn through the whole allowance.
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET' && (req.path.startsWith('/api/upload/') || req.path === '/api/health' || !req.path.startsWith('/api/')),
  message: { error: 'Too many requests. Please wait a few minutes and try again.' },
}));

app.use(cors({
  origin(origin, cb) {
    // No Origin header = same-origin navigation / curl / server-to-server.
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) return cb(null, true);
    return cb(null, false);
  },
  credentials: true, // Required for cookies/sessions
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (isProd && !process.env.SESSION_SECRET) {
  console.warn('⚠️  SESSION_SECRET is not set in production. Set a long random value in your Render environment.');
}

// If the client is hosted on a different origin than the API (e.g. a Render Static Site +
// a Render Web Service) the session cookie is cross-site and MUST be SameSite=None; Secure.
// When the API serves the client itself (same origin) 'lax' is fine and safer.
const crossSite = process.env.CROSS_SITE_COOKIES === 'true';
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'dev_secret_key_123',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: isProd,
    httpOnly: true,
    sameSite: crossSite && isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// API Routes
app.use('/api/upload', uploadRouter);
app.use('/api/jobs', jobsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Serve the built React client from this same service (single-service deploy).
// Same origin => no CORS or cross-site cookie problems, and SPA routes survive a refresh.
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const isSize = err.code === 'LIMIT_FILE_SIZE';
  res.status(isSize ? 413 : err.status || 500).json({
    error: isSize ? 'Your PDF must be under 5 MB.' : (isProd && !err.status ? 'Internal Server Error' : err.message || 'Internal Server Error'),
  });
});

export default app;
