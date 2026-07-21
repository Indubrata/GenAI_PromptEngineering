import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { initSocket } from './config/socket.js';
import './workers/resumeWorker.js';

dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3000;

// Create HTTP server wrapping the Express app
const server = http.createServer(app);

// Initialize Socket.io with the HTTP server
initSocket(server);

// Start listening
server.listen(PORT, () => {
  console.log(`🚀 CheckMyResume API Server running on port ${PORT}`);
});
