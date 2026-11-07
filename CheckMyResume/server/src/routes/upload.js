import express from 'express';
import multer from 'multer';
import { addResumeJob, resumeQueue } from '../services/queue.js';
import { redisClient } from '../config/redis.js';
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  // Browsers/OSes label PDFs inconsistently (application/pdf, application/x-pdf, octet-stream, or empty),
  // so trust the extension here and verify the real %PDF- signature in the handler.
  fileFilter: (req, file, cb) => cb(null, /\.pdf$/i.test(file.originalname))
});
router.post('/', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Only PDF files are accepted. Please choose a .pdf file.' });
    if (!req.file.buffer.subarray(0, 1024).includes(Buffer.from('%PDF-'))) {
      return res.status(400).json({ error: 'This file is not a valid PDF. Export your resume as PDF and try again.' });
    }
    if (redisClient.status !== 'ready') return res.status(503).json({ error: 'Resume processing is temporarily unavailable. Please try again shortly.' });
    req.session.uploads = (req.session.uploads || 0) + 1;
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
    const job = await addResumeJob(req.sessionID, req.file.buffer, 'application/pdf', req.body.targetRole, req.body.targetDescription);
    res.status(202).json({ jobId: job.id, sessionId: req.sessionID });
  } catch (error) { next(error); }
});
// Durable status prevents losing a result if analysis finishes before the client connects.
router.get('/:jobId', async (req, res, next) => {
  try {
    const job = await resumeQueue.getJob(req.params.jobId);
    if (!job || job.data.sessionId !== req.sessionID) return res.status(404).json({ error: 'Analysis not found. Please upload your resume again.' });
    const status = await job.getState();
    res.json({ status, step: job.progress?.step || 'parsing', data: status === 'completed' ? job.returnvalue.data : undefined, error: status === 'failed' ? job.failedReason : undefined });
  } catch (error) { next(error); }
});
export default router;
