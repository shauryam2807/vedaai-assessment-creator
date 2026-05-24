import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Express error shape that may include a status code.
 */
interface AppError extends Error {
  statusCode?: number;
}

/**
 * Global error-handling middleware.
 * Must be registered LAST in the middleware chain (4-argument signature).
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`❌ [${statusCode}] ${message}`);
  if (env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
