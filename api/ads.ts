import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { adsService } from '../src/lib/services/adsService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = adsService.getAll();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const data = adsService.create(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'Sponsor / Iklan baru berhasil ditambahkan',
      data,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
