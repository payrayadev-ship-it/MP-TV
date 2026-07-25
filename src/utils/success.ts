import type { VercelResponse } from '@vercel/node';

export function handleSuccess(res: VercelResponse, data: any, message = 'Operasi berhasil', status = 200) {
  const payload = {
    success: true,
    message,
    data,
  };
  if (typeof res.status === 'function') {
    return res.status(status).json(payload);
  }
  (res as any).statusCode = status;
  (res as any).setHeader('Content-Type', 'application/json');
  return (res as any).end(JSON.stringify(payload));
}
