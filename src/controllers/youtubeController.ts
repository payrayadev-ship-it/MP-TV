import { Request, Response, NextFunction } from 'express';
import { youtubeService } from '../services/youtubeService';

export const youtubeController = {
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = youtubeService.getStatus();
      res.json({
        success: true,
        message: 'Status streaming YouTube berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
