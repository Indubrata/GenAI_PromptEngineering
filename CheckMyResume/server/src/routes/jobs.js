import express from 'express';
import { fetchLiveJobs, fetchRecruitersAtCompany } from '../services/jobScraper.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * POST /api/jobs/matches
 * Fetches real LinkedIn job postings matching a user's role via BrightData.
 */
router.post('/matches',
  [
    body('jobTitle').isString().trim().notEmpty().withMessage('Job title is required'),
    body('limit').optional().isInt({ min: 1, max: 10 }).toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { jobTitle, limit } = req.body;
      const result = await fetchLiveJobs(jobTitle, limit || 3);
      res.json(result);
    } catch (error) {
      console.error('Error fetching job matches:', error);
      res.status(500).json({ error: 'Failed to fetch job matches.' });
    }
  }
);

/**
 * POST /api/jobs/recruiters
 * Fetches real recruiters/hiring managers at a company via BrightData.
 * Used to power the Auto-Drafted Recruiter Messages section.
 */
router.post('/recruiters',
  [
    body('company').isString().trim().notEmpty().withMessage('Company name is required'),
    body('jobTitle').isString().trim().notEmpty().withMessage('Job title is required'),
    body('limit').optional().isInt({ min: 1, max: 5 }).toInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { company, jobTitle, limit } = req.body;
      const result = await fetchRecruitersAtCompany(company, jobTitle, limit || 2);
      res.json(result);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
      res.status(500).json({ error: 'Failed to fetch recruiters.' });
    }
  }
);

export default router;
