import { Queue } from 'bullmq';
import { getRedisConnectionOptions } from '../config/redis';

/**
 * BullMQ queue for assessment generation jobs.
 * Each job payload contains the assignment ID to process.
 */
export const assessmentQueue = new Queue('assessment-generation', {
  ...getRedisConnectionOptions(),
  defaultJobOptions: {
    removeOnComplete: { count: 100 },  // Keep last 100 completed jobs
    removeOnFail: { count: 50 },       // Keep last 50 failed jobs
    attempts: 2,                        // Retry once on failure
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

/** Job payload shape */
export interface AssessmentJobData {
  assignmentId: string;
}
