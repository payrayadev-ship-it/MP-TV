import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { scheduleService } from '../src/lib/services/scheduleService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = scheduleService.getAll();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const data = scheduleService.create(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'Jadwal siaran berhasil ditambahkan',
      data,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
