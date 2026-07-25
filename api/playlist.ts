import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { playlistService } from '../src/services/playlistService';
import { handleSuccess } from '../src/utils/success';
import { handleError } from '../src/utils/error';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = playlistService.getAll();
    return handleSuccess(res, data, 'Daftar playlist berhasil diambil');
  }

  if (req.method === 'POST') {
    const { name, category } = req.body || {};
    const data = playlistService.create(name, category);
    return handleSuccess(res, data, 'Playlist berhasil dibuat', 201);
  }

  if (req.method === 'PUT') {
    const data = playlistService.update(req.body || {});
    return handleSuccess(res, data, 'Playlist berhasil diperbarui');
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) {
      return handleError(res, 'ID Playlist diperlukan', 400);
    }
    const result = playlistService.delete(id);
    return handleSuccess(res, result, result.message);
  }

  return handleError(res, 'Method Not Allowed', 405);
});
