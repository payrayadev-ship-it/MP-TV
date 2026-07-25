import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { youtubeService } from '../src/lib/services/youtubeService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  const data = youtubeService.getStatus();
  return res.status(200).json({ success: true, data });
});
