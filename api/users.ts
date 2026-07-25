import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { userService } from '../src/lib/services/userService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = userService.getAll();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const data = userService.create(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'Operator / Pengguna berhasil ditambahkan',
      data,
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
