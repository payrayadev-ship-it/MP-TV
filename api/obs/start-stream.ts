import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { obsService } from '../../src/services/obsService';
import { handleSuccess } from '../../src/utils/success';
import { handleError } from '../../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return handleError(res, 'Method Not Allowed', 405);
  }
  const result = obsService.startStream();
  return handleSuccess(res, result, 'Siaran Live Streaming OBS Dimulai');
});
