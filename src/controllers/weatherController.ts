import { Request, Response, NextFunction } from 'express';
import { weatherService } from '../services/weatherService';

export const weatherController = {
  async getWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const result = weatherService.getWeather();
      res.json({
        success: true,
        message: 'Data cuaca Majalengka berhasil diambil',
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  },
};
