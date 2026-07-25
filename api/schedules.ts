import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { scheduleService } from '../src/services/scheduleService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = scheduleService.getAll();
    return handleSuccess(res, data, 'Daftar jadwal siaran berhasil diambil');
  }

  if (req.method === 'POST') {
    const data = scheduleService.create(req.body || {});
    return handleSuccess(res, data, 'Jadwal siaran berhasil ditambahkan', 201);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
