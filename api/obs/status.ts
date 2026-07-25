import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { obsService } from '../../src/lib/services/obsService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  const obs = obsService.getStatus();
  return res.status(200).json({ success: true, obs });
});
