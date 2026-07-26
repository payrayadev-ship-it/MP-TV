import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export const usersController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = userService.getAll();
      res.json({
        success: true,
        message: 'Daftar pengguna berhasil diambil',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = userService.create(req.body || {});
      res.status(201).json({
        success: true,
        message: 'Operator / Pengguna berhasil ditambahkan',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
