import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { settingsService } from '../src/lib/services/settingsService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = settingsService.getSettings();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const data = settingsService.update(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'Pengaturan berhasil disimpan',
      data,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
