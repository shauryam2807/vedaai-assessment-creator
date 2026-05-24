import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validated environment configuration.
 * All values are read from process.env and given sensible defaults where safe.
 */
export const env = {
  /** Server port */
  PORT: parseInt(process.env.PORT || '5000', 10),

  /** MongoDB connection string */
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai',

  /** Redis connection URL */
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  /** Google Gemini API key */
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  /** Allowed CORS origin for the frontend */
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  /** Current environment */
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
} as const;

/**
 * Validates that all critical environment variables are set.
 * Throws immediately on startup if anything essential is missing.
 */
export function validateEnv(): void {
  const required: Array<keyof typeof env> = ['MONGODB_URI', 'GEMINI_API_KEY'];
  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file.'
    );
  }
}
