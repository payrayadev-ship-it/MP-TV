import { Request, Response, NextFunction } from 'express';
import { videoService } from '../services/videoService';

export const videosController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = videoService.getAll();
      res.json({
        success: true,
        message: 'Daftar video berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = videoService.create(req.body || {});
      res.status(201).json({
        success: true,
        message: 'Video berhasil ditambahkan',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
