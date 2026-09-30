import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled request error:', {
    message: err.message,
    path: req.path,
    method: req.method
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
