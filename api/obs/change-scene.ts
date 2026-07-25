import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../../src/utils/apiHandler';
import { obsService } from '../../src/services/obsService';
import { handleSuccess } from '../../src/utils/success';
import { handleError } from '../../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return handleError(res, 'Method Not Allowed', 405);
  }
  const { sceneName } = req.body || {};
  if (!sceneName) {
    return handleError(res, 'sceneName diperlukan', 400);
  }
  const result = obsService.changeScene(sceneName);
  return handleSuccess(res, result, `Scene OBS berhasil diubah ke "${sceneName}"`);
});
