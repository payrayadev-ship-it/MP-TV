import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { aiPresenterService } from '../../src/services/aiPresenterService';
import { handleSuccess } from '../../src/utils/success';
import { handleError } from '../../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return handleError(res, 'Method Not Allowed', 405);
  }
  const data = aiPresenterService.getAll();
  return handleSuccess(res, data, 'Daftar tugas AI Presenter berhasil diambil');
});
