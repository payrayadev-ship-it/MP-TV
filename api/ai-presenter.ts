import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { aiPresenterService } from '../src/lib/services/aiPresenterService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  const data = aiPresenterService.getAll();
  return res.status(200).json({ success: true, data });
});
