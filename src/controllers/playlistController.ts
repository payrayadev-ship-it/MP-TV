import { Request, Response, NextFunction } from 'express';
import { playlistService } from '../services/playlistService';

export const playlistController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = playlistService.getAll();
      res.json({
        success: true,
        message: 'Daftar playlist berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, category } = req.body || {};
      const data = playlistService.create(name, category);
      res.status(201).json({
        success: true,
        message: 'Playlist berhasil dibuat',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = playlistService.update(req.body || {});
      res.json({
        success: true,
        message: 'Playlist berhasil diperbarui',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID Playlist diperlukan',
          error: 'Missing ID',
        });
      }
      const result = playlistService.delete(id);
      res.json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
