import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { breakingNewsService } from '../src/lib/services/breakingNewsService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = breakingNewsService.getAll();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const data = breakingNewsService.create(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'BREAKING NEWS diaktifkan & disiarkan!',
      data,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
