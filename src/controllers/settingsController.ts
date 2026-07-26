import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settingsService';

export const settingsController = {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const data = settingsService.getSettings();
      res.json({
        success: true,
        message: 'Pengaturan berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = settingsService.update(req.body || {});
      res.json({
        success: true,
        message: 'Pengaturan berhasil disimpan',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
