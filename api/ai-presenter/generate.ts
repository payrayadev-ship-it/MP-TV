import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { aiPresenterService } from '../../src/services/aiPresenterService';
import { handleSuccess } from '../../src/utils/success';
import { handleError } from '../../src/utils/error';

export default createApiHandler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return handleError(res, 'Method Not Allowed', 405);
  }

  const task = await aiPresenterService.generate(req.body || {});
  return handleSuccess(res, task, 'Penyiar AI berhasil memproses naskah siaran TV', 201);
});
