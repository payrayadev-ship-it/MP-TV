import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { newsService } from '../src/services/newsService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = await newsService.getAll();
    return handleSuccess(res, data, 'Daftar berita berhasil diambil');
  }

  if (req.method === 'POST') {
    const newArticle = await newsService.create(req.body || {});
    return handleSuccess(res, newArticle, 'Berita berhasil diterbitkan', 201);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
