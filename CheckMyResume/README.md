# CheckMyResume

CheckMyResume is an AI-assisted resume workspace. Upload a text-based PDF resume, evaluate it against a target role and job description, improve the extracted content in an editor, then download a polished PDF or DOCX version. The application also provides job and recruiter discovery links, with optional live Bright Data results when that integration is configured.

## Highlights

- **AI resume analysis:** extracts structured resume data from a PDF, calculates an ATS-style score, and returns actionable feedback tailored to a role and job description.
- **Editable digital resume:** update contact details, summary, experience, education, skills, projects, and custom sections without losing the analysis context.
- **Live scoring assistance:** built-in suggestions for grammar, keywords, and role-aligned skills.
- **Exports:** download the edited resume as PDF or DOCX.
- **Job matching:** retrieve live jobs and recruiter data through Bright Data when available, with targeted LinkedIn, Google, and Indeed search links as a dependable fallback.
- **Polished experience:** responsive React interface with light and dark themes, keyboard-friendly FAQ controls, motion-aware visual effects, and clear error states.

## Architecture

| Area | Technology |
| --- | --- |
| Client | React 19, Vite, React Router, GSAP, Socket.IO client, OGL |
| API | Node.js, Express 5, Socket.IO, Helmet, CORS, rate limiting |
| AI | Groq, using a primary model with an automatic fallback model |
| Background processing | BullMQ and Redis |
| Persistence | Prisma with PostgreSQL schema support |
| Document handling | `pdf-parse`, Puppeteer, and `docx` |
| Job data | Bright Data Dataset API, with browser-search fallbacks |
| Deployment | Render blueprint and Docker Compose for local services |

## Requirements

- Node.js 20 or later
- npm 10 or later
- Docker and Docker Compose (recommended for local Redis and PostgreSQL)
- A [Groq API key](https://console.groq.com/keys) for resume analysis
- A Bright Data API key only if live job and recruiter collection is needed

## Quick start

1. Clone the repository and open this project directory.

   ```bash
   cd CheckMyResume
   ```

2. Create your local environment file.

   ```bash
   cp .env.example .env
   ```

   Set `GROQ_API_KEY` in `.env`. Keep the file private: it is ignored by Git and must never be committed.

3. Start the local data services.

   ```bash
   docker compose up -d
   ```

4. Install client and server dependencies.

   ```bash
   npm --prefix client ci
   npm --prefix server ci
   ```

5. Start the API and the web app in separate terminals.

   ```bash
   npm --prefix server run dev
   ```

   ```bash
   npm --prefix client run dev
   ```

6. Open the URL printed by Vite, normally `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://127.0.0.1:3000` by default. To use another API address, set `API_PROXY_TARGET` before starting Vite. For a separately hosted client build, set `VITE_API_URL` to the public API origin at build time.

## Environment variables

Copy `.env.example` to `.env` and provide only the values applicable to your environment.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | Authorizes AI-powered PDF parsing, feedback, and scoring. |
| `BRIGHT_DATA_API_KEY` | No | Enables Bright Data live jobs and recruiter collection. Search links remain available without it. |
| `DATABASE_URL` | For Prisma persistence | PostgreSQL connection string. |
| `REDIS_URL` | Yes for processing | Redis connection for BullMQ resume-processing jobs and sessions. |
| `SESSION_SECRET` | Yes in production | Securely signs user sessions. Use a strong, unique random value. |
| `PORT` | No | API port, default `3000`. |
| `NODE_ENV` | No | Runtime mode, normally `development` or `production`. |
| `CLIENT_URL` | Production | Comma-separated allowed client origins for CORS and Socket.IO. |
| `CROSS_SITE_COOKIES` | Conditional | Set to `true` only when client and API are deployed on different origins. |
| `VITE_API_URL` | Conditional | Public API origin for a separately deployed client. This value is embedded during the client build. |
| `BROWSER_EXECUTABLE_PATH` | No | Optional Chrome or Chromium executable for PDF export. |

## Available commands

Run these from the `CheckMyResume` directory.

| Command | Description |
| --- | --- |
| `npm --prefix client run dev` | Start the Vite development server. |
| `npm --prefix client run build` | Create a production client build. |
| `npm --prefix client run lint` | Run client linting. |
| `npm --prefix server run dev` | Start the API with file watching and root `.env` loading. |
| `npm --prefix server start` | Start the production API. It serves `client/dist` when it exists. |
| `npm --prefix server test` | Run server unit tests. |
| `npm --prefix server run test:integration` | Run API integration tests against a running local API. |
| `npm --prefix server run db:generate` | Generate the Prisma client. |
| `npm --prefix server run db:push` | Apply the Prisma schema to the configured database. |
| `docker compose up -d` | Start local PostgreSQL and Redis containers. |
| `docker compose down` | Stop local containers while retaining named volumes. |

## How the analysis flow works

1. The browser uploads a PDF resume, currently limited to 5 MB.
2. The API checks the `.pdf` extension and verifies the PDF signature before queuing it.
3. BullMQ stores a short-lived processing job in Redis; a worker extracts text and asks Groq for structured resume data, an ATS-style score, and role-specific feedback.
4. The client polls for completion and receives real-time Socket.IO progress events when available.
5. The user refines the parsed resume in the editor and exports it as PDF or DOCX.

Only text-based PDFs are supported. Image-only or scanned PDFs require OCR before upload.

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health status, including Redis connection state. |
| `POST` | `/api/upload` | Accept a PDF in the `resume` multipart field and queue analysis. |
| `GET` | `/api/upload/:jobId` | Retrieve the authenticated session's analysis status and completed result. |
| `POST` | `/api/export/pdf` | Generate a PDF from resume content. |
| `POST` | `/api/export/docx` | Generate a DOCX from resume content. |
| `POST` | `/api/jobs/matches` | Get live job matches or targeted search URLs. |
| `POST` | `/api/jobs/recruiters` | Get recruiter results or targeted search URLs. |

## Production deployment

The included [`render.yaml`](./render.yaml) defines a single Render web service plus a managed Redis-compatible Key Value store. The service builds the Vite client, starts the Node API, and serves the built app and API from the same origin.

To deploy with Render:

1. Create a new Blueprint from this repository.
2. Set `GROQ_API_KEY` and, optionally, `BRIGHT_DATA_API_KEY` in the Render dashboard.
3. Set `CLIENT_URL` to the deployed service URL.
4. Use the generated `SESSION_SECRET` or provide a secure replacement.

For a production database, configure `DATABASE_URL` and run the appropriate Prisma migration workflow before relying on persistent resume records.

## Project layout

```text
CheckMyResume/
├── client/                 # React and Vite application
│   └── src/
│       ├── components/     # Landing, analysis, editor, export, and shared UI
│       ├── context/        # Resume and theme state
│       └── hooks/          # Reusable client hooks
├── server/                 # Express API and background worker
│   ├── prisma/             # PostgreSQL schema
│   ├── src/routes/         # Upload, export, and job endpoints
│   ├── src/services/       # AI, queue, PDF parsing, and job integrations
│   └── test/               # Server and integration tests
├── tests/                  # Fixtures and verification artifacts
├── docker-compose.yml      # Local PostgreSQL and Redis
├── render.yaml             # Render deployment blueprint
└── .env.example            # Safe environment-variable template
```

## Security and privacy notes

- Do not commit `.env`, API keys, or resume files containing personal information.
- The application accepts PDFs only and rejects uploads larger than 5 MB.
- Sessions are stored in Redis and analysis results are scoped to the submitting session.
- Production deployments should use HTTPS, a strong `SESSION_SECRET`, narrowly scoped `CLIENT_URL` values, and current credentials for all third-party services.
- Resume content is sent to the configured AI provider for analysis. Review that provider's data-handling terms before using real applicant data in a production environment.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Analysis cannot start | Confirm Redis is running, `REDIS_URL` is correct, and `GROQ_API_KEY` is present. |
| PDF upload is rejected | Use a text-based `.pdf` file under 5 MB. Scanned/image-only files are not supported. |
| Client cannot reach the API | Start the API on port `3000`, or set `API_PROXY_TARGET` / `VITE_API_URL` for the intended API address. |
| PDF export fails in deployment | Ensure Puppeteer can access Chrome or Chromium, or set `BROWSER_EXECUTABLE_PATH`. |
| No live job results | Verify `BRIGHT_DATA_API_KEY`; the interface will still offer targeted search links if Bright Data is unavailable. |
