import type { VercelResponse } from '@vercel/node';

export function handleServerError(res: VercelResponse, err: any) {
  console.error('[ServerError]', err);
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: String(err),
  });
}
