import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { weatherService } from '../src/lib/services/weatherService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  const result = weatherService.getWeather();
  return res.status(200).json({ success: true, data: result.data, lastSync: result.lastSync });
});
