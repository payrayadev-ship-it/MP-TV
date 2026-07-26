import { Request, Response, NextFunction } from 'express';
import { newsService } from '../services/newsService';

export const articlesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const articles = await newsService.getAll();
      res.json({
        success: true,
        message: 'Daftar berita berhasil diambil',
        data: articles,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await newsService.create(req.body || {});
      res.status(201).json({
        success: true,
        message: 'Berita berhasil diterbitkan',
        data: article,
      });
    } catch (err) {
      next(err);
    }
  },
};
