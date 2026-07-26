import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';

export const dashboardController = {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = dashboardService.getDashboard();
      res.json({
        success: true,
        message: 'Data dashboard berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
