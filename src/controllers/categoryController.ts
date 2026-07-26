import { Request, Response, NextFunction } from 'express';

const defaultCategories = [
  { id: 'cat-1', name: 'Berita', count: 12 },
  { id: 'cat-2', name: 'Kuliner & Wisata', count: 8 },
  { id: 'cat-3', name: 'Pemerintahan', count: 15 },
  { id: 'cat-4', name: 'Olahraga & Komunitas', count: 6 },
  { id: 'cat-5', name: 'Sponsor / Iklan', count: 4 },
];

export const categoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        message: 'Daftar kategori siaran MPTV',
        data: defaultCategories,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body || {};
      const newCategory = { id: `cat-${Date.now()}`, name: name || 'Kategori Baru', count: 0 };
      defaultCategories.push(newCategory);
      res.status(201).json({
        success: true,
        message: 'Kategori baru berhasil ditambahkan',
        data: newCategory,
      });
    } catch (err) {
      next(err);
    }
  },
};
