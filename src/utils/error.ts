import type { VercelResponse } from '@vercel/node';

export function handleError(res: VercelResponse, error: string | Error, status = 500) {
  const message = typeof error === 'string' ? error : error.message;
  const payload = {
    success: false,
    message,
    error: message,
  };
  if (typeof res.status === 'function') {
    return res.status(status).json(payload);
  }
  (res as any).statusCode = status;
  (res as any).setHeader('Content-Type', 'application/json');
  return (res as any).end(JSON.stringify(payload));
}
