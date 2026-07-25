import type { VercelResponse } from '@vercel/node';

export function handleSuccess(res: VercelResponse, data: any, message = 'Operasi berhasil', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}
