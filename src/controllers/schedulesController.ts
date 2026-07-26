import { Request, Response, NextFunction } from 'express';
import { scheduleService } from '../services/scheduleService';

export const schedulesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = scheduleService.getAll();
      res.json({
        success: true,
        message: 'Daftar jadwal siaran berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = scheduleService.create(req.body || {});
      res.status(201).json({
        success: true,
        message: 'Jadwal siaran berhasil ditambahkan',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
