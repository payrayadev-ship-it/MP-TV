import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { analyticsService } from '../src/lib/services/analyticsService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  const data = analyticsService.getAnalytics();
  return res.status(200).json({ success: true, data });
});
