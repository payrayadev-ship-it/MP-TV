import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { dashboardService } from '../src/services/dashboardService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return handleError(res, 'Method Not Allowed', 405);
  }
  const data = dashboardService.getDashboard();
  return handleSuccess(res, data, 'Data dashboard berhasil diambil');
});
