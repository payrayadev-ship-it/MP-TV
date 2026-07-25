import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { newsService } from '../src/lib/services/newsService';

export default createApiHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = await newsService.getAll();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const newArticle = await newsService.create(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'Berita berhasil diterbitkan',
      data: newArticle,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
