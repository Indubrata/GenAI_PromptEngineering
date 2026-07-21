import express from 'express';
import multer from 'multer';
import { addResumeJob } from '../services/queue.js';

const router = express.Router();

// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit matching frontend
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// POST /api/upload
router.post('/', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const { targetRole, targetDescription } = req.body;
    
    // Fallback session ID if anonymous session middleware isn't fully bound yet
    const sessionId = req.sessionID || `temp_${Date.now()}`;

    // Add processing job to BullMQ
    const job = await addResumeJob(
      sessionId,
      req.file.buffer,
      req.file.mimetype,
      targetRole,
      targetDescription
    );

    res.status(202).json({
      message: 'Resume received and added to processing queue.',
      jobId: job.id,
      sessionId: sessionId // Send back to client so they can listen to correct socket room
    });

  } catch (error) {
    next(error);
  }
});

export default router;
