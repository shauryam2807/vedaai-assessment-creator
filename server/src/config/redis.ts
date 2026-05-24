import IORedis from 'ioredis';
import { env } from './env';

/**
 * Shared Redis client used by both the application layer (caching)
 * and BullMQ (job queue). BullMQ creates its own connections internally,
 * but this instance is used for manual cache reads/writes.
 */
export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
  tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
  retryStrategy: (times) => {
    // Retry a few times, then give up to avoid crashing without redis
    if (times > 5) return null;
    return Math.min(times * 200, 2000);
  }
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});

redis.on('close', () => {
  console.warn('⚠️  Redis connection closed');
});

// Explicitly connect since lazyConnect is true
redis.connect().catch((err) => {
  console.warn('⚠️ Redis initial connection failed (will retry):', err.message);
});

/**
 * Returns a plain connection options object suitable for BullMQ Queue / Worker.
 * BullMQ needs its own connections, so we give it the raw config rather than
 * sharing a single IORedis instance.
 */
export function getRedisConnectionOptions() {
  const url = new URL(env.REDIS_URL);
  const isTLS = env.REDIS_URL.startsWith('rediss://');

  return {
    connection: {
      host: url.hostname || 'localhost',
      port: parseInt(url.port || '6379', 10),
      password: url.password || undefined,
      username: url.username || 'default',
      tls: isTLS ? {} : undefined,
      maxRetriesPerRequest: null,
    },
  };
}
