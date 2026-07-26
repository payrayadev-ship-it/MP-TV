import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body || {};
      const users = userService.getAll();
      const user = users.find((u) => u.email === email) || users[0];
      res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          token: `mptv-jwt-${Date.now()}`,
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const users = userService.getAll();
      res.json({
        success: true,
        message: 'Data pengguna aktif',
        data: users[0],
      });
    } catch (err) {
      next(err);
    }
  },
};
