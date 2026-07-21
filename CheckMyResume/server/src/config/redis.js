import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Base client for general operations & session store
export const redisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

// Dedicated clients for BullMQ as required by the library
export const redisQueueClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const redisSubscriberClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisQueueClient.on('error', (err) => console.error('Redis Queue Error', err));
