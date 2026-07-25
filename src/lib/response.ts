import type { VercelResponse } from '@vercel/node';

export function sendSuccess(res: VercelResponse, data: any, message = 'Success', statusCode = 200) {
  const payload = {
    success: true,
    message,
    data,
  };
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(payload);
  }
  (res as any).statusCode = statusCode;
  (res as any).setHeader('Content-Type', 'application/json');
  return (res as any).end(JSON.stringify(payload));
}

export function sendError(res: VercelResponse, error: string, statusCode = 500) {
  const payload = {
    success: false,
    message: error,
    error,
  };
  if (typeof res.status === 'function') {
    return res.status(statusCode).json(payload);
  }
  (res as any).statusCode = statusCode;
  (res as any).setHeader('Content-Type', 'application/json');
  return (res as any).end(JSON.stringify(payload));
}
