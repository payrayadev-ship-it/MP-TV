import { Request, Response, NextFunction } from 'express';
import { videoService } from '../services/videoService';

export const uploadController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const video = videoService.create(req.body || {});
      res.status(201).json({
        success: true,
        message: 'Video / Media berhasil diupload ke server MPTV',
        data: video,
      });
    } catch (err) {
      next(err);
    }
  },
};
