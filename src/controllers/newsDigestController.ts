import { Request, Response, NextFunction } from 'express';
import { aiPresenterService } from '../services/aiPresenterService';
import { newsService } from '../services/newsService';
import { geminiService } from '../services/gemini';

export const newsDigestController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = aiPresenterService.getAll();
      res.json({
        success: true,
        message: 'Daftar tugas AI Presenter & News Digest',
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },

  async generateScript(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await aiPresenterService.generate(req.body || {});
      res.status(201).json({
        success: true,
        message: 'Penyiar AI berhasil memproses naskah siaran TV',
        data: task,
      });
    } catch (err) {
      next(err);
    }
  },

  async generateExecutiveDigest(req: Request, res: Response, next: NextFunction) {
    try {
      const news = await newsService.getAll();
      const digest = await geminiService.generateNewsDigest(news);
      res.json({
        success: true,
        message: 'News Digest harian MPTV berhasil dibuat',
        data: { digest, generatedAt: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  },
};
