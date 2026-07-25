import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { runningTextService } from '../src/lib/services/runningTextService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = runningTextService.getAll();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const data = runningTextService.create(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'Running text berhasil ditambahkan',
      data,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
