import { Queue, Worker, QueueEvents } from 'bullmq';
import { redisQueueClient } from '../config/redis.js';

// Resume Processing Queue (Parsing + AI Analysis)
export const resumeQueue = new Queue('resumeProcessing', {
  connection: redisQueueClient
});

// Job Scraping Queue (Finding relevant jobs based on parsed resume)
export const scrapingQueue = new Queue('jobScraping', {
  connection: redisQueueClient
});

// Queue Events for monitoring (useful for WebSockets)
export const resumeQueueEvents = new QueueEvents('resumeProcessing', {
  connection: redisQueueClient
});

export const scrapingQueueEvents = new QueueEvents('jobScraping', {
  connection: redisQueueClient
});

export async function addResumeJob(sessionId, fileBuffer, mimeType, targetRole, targetDescription) {
  return await resumeQueue.add('analyze', {
    sessionId,
    fileBuffer: fileBuffer.toString('base64'), // Store as base64 in redis
    mimeType,
    targetRole,
    targetDescription
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  });
}
