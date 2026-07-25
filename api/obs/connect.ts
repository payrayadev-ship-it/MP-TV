import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { obsService } from '../../src/services/obsService';
import { handleSuccess } from '../../src/utils/success';
import { handleError } from '../../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return handleError(res, 'Method Not Allowed', 405);
  }
  const obs = obsService.connect(req.body || {});
  return handleSuccess(res, obs, 'OBS WebSocket terhubung sukses');
});
