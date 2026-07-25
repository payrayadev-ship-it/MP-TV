import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { settingsService } from '../src/services/settingsService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = settingsService.getSettings();
    return handleSuccess(res, data, 'Pengaturan berhasil diambil');
  }

  if (req.method === 'POST') {
    const data = settingsService.update(req.body || {});
    return handleSuccess(res, data, 'Pengaturan berhasil disimpan');
  }

  return handleError(res, 'Method Not Allowed', 405);
});
