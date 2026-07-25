import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { runningTextService } from '../src/services/runningTextService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = runningTextService.getAll();
    return handleSuccess(res, data, 'Daftar running text berhasil diambil');
  }

  if (req.method === 'POST') {
    const data = runningTextService.create(req.body || {});
    return handleSuccess(res, data, 'Running text berhasil ditambahkan', 201);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
