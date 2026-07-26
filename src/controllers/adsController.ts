import { Request, Response, NextFunction } from 'express';
import { adsService } from '../services/adsService';

export const adsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = adsService.getAll();
      res.json({
        success: true,
        message: 'Daftar iklan berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = adsService.create(req.body || {});
      res.status(201).json({
        success: true,
        message: 'Sponsor / Iklan baru berhasil ditambahkan',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
