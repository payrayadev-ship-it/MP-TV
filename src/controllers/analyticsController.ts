import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';

export const analyticsController = {
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = analyticsService.getAnalytics();
      res.json({
        success: true,
        message: 'Data analitik siaran berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
