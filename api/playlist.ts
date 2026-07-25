import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiHandler } from '../src/utils/apiHandler';
import { playlistService } from '../src/lib/services/playlistService';

export default createApiHandler((req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const data = playlistService.getAll();
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    const { name, category } = req.body || {};
    const data = playlistService.create(name, category);
    return res.status(200).json({
      success: true,
      message: 'Playlist berhasil dibuat',
      data,
    });
  }

  if (req.method === 'PUT') {
    const data = playlistService.update(req.body || {});
    return res.status(200).json({
      success: true,
      message: 'Playlist berhasil diperbarui',
      data,
    });
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id as string) || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, error: 'ID Playlist diperlukan' });
    }
    const result = playlistService.delete(id);
    return res.status(200).json({ success: true, ...result });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
});
