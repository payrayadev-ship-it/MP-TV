import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { breakingNewsService } from '../src/services/breakingNewsService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = breakingNewsService.getAll();
    return handleSuccess(res, data, 'Daftar breaking news berhasil diambil');
  }

  if (req.method === 'POST') {
    const data = breakingNewsService.create(req.body || {});
    return handleSuccess(res, data, 'BREAKING NEWS diaktifkan & disiarkan!', 201);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
