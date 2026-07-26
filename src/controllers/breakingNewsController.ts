import { Request, Response, NextFunction } from 'express';
import { breakingNewsService } from '../services/breakingNewsService';

export const breakingNewsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = breakingNewsService.getAll();
      res.json({
        success: true,
        message: 'Daftar breaking news berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = breakingNewsService.create(req.body || {});
      res.status(201).json({
        success: true,
        message: 'BREAKING NEWS diaktifkan & disiarkan!',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
