import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { adsService } from '../src/services/adsService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = adsService.getAll();
    return handleSuccess(res, data, 'Daftar iklan berhasil diambil');
  }

  if (req.method === 'POST') {
    const data = adsService.create(req.body || {});
    return handleSuccess(res, data, 'Sponsor / Iklan baru berhasil ditambahkan', 201);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
