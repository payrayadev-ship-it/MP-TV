import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { videoService } from '../src/services/videoService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = videoService.getAll();
    return handleSuccess(res, data, 'Daftar video berhasil diambil');
  }

  if (req.method === 'POST') {
    const data = videoService.create(req.body || {});
    return handleSuccess(res, data, 'Video berhasil ditambahkan', 201);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
