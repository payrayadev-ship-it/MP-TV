import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { userService } from '../src/services/userService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = userService.getAll();
    return handleSuccess(res, data, 'Daftar pengguna berhasil diambil');
  }

  if (req.method === 'POST') {
    const data = userService.create(req.body || {});
    return handleSuccess(res, data, 'Operator / Pengguna berhasil ditambahkan', 201);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
