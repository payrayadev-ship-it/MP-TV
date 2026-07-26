import { Request, Response, NextFunction } from 'express';
import { obsService } from '../services/obsService';

export const obsController = {
  async connect(req: Request, res: Response, next: NextFunction) {
    try {
      const data = obsService.connect(req.body || {});
      res.json({
        success: true,
        message: 'OBS WebSocket terhubung sukses',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = obsService.getStatus();
      res.json({
        success: true,
        message: 'Status OBS berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async startStream(req: Request, res: Response, next: NextFunction) {
    try {
      const data = obsService.startStream();
      res.json({
        success: true,
        message: 'Siaran Live Streaming OBS Dimulai',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async stopStream(req: Request, res: Response, next: NextFunction) {
    try {
      const data = obsService.stopStream();
      res.json({
        success: true,
        message: 'Siaran Live Streaming OBS Dihentikan',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async changeScene(req: Request, res: Response, next: NextFunction) {
    try {
      const { sceneName } = req.body || {};
      if (!sceneName) {
        return res.status(400).json({
          success: false,
          message: 'sceneName diperlukan',
          error: 'Missing sceneName',
        });
      }
      const data = obsService.changeScene(sceneName);
      res.json({
        success: true,
        message: `Scene OBS berhasil diubah ke "${sceneName}"`,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async emergencyStop(req: Request, res: Response, next: NextFunction) {
    try {
      const result = obsService.emergencyStop();
      res.json({
        success: true,
        message: result.message,
        data: result.obsStatus,
      });
    } catch (err) {
      next(err);
    }
  },
};
