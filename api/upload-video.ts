import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { videoService } from '../src/lib/services/videoService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const data = videoService.create(req.body || {});
  return res.status(200).json({
    success: true,
    message: 'Video berhasil diupload ke server MPTV',
    data,
  });
});
