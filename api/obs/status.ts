import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { obsService } from '../../src/services/obsService';
import { handleSuccess } from '../../src/utils/success';
import { handleError } from '../../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return handleError(res, 'Method Not Allowed', 405);
  }
  const obs = obsService.getStatus();
  return handleSuccess(res, obs, 'Status OBS berhasil diambil');
});
