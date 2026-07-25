import type { VercelResponse } from '@vercel/node';

export function handleError(res: VercelResponse, error: string | Error, status = 500) {
  const message = typeof error === 'string' ? error : error.message;
  return res.status(status).json({
    success: false,
    message,
    error: message,
  });
}
