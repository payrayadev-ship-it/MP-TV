import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { youtubeService } from '../src/services/youtubeService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return handleError(res, 'Method Not Allowed', 405);
  }
  const data = youtubeService.getStatus();
  return handleSuccess(res, data, 'Status streaming YouTube berhasil diambil');
});
