import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { aiPresenterService } from '../../src/lib/services/aiPresenterService';

export default createApiHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const task = await aiPresenterService.generate(req.body || {});
  return res.status(200).json({
    success: true,
    message: 'Penyiar AI berhasil memproses naskah siaran TV',
    data: task,
  });
});
