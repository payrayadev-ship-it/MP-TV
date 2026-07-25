import type { VercelResponse } from '@vercel/node';

export function sendSuccess(res: VercelResponse, data: any, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res: VercelResponse, error: string, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message: error,
    error,
  });
}
