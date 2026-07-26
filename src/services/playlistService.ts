import { playlistRepository } from '../repositories/playlistRepository';
import { Playlist } from '../types';

export const playlistService = {
  getAll(): Playlist[] {
    return playlistRepository.getAll();
  },

  create(name?: string, category?: any): Playlist {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name: name || 'Playlist Baru Majalengka',
      category: category || 'Berita',
      items: [],
      repeat: true,
      shuffle: false,
      totalDurationSeconds: 0,
      active: false,
    };
    return playlistRepository.create(newPl);
  },

  update(data: Partial<Playlist> & { id: string }): Playlist {
    const existing = (playlistRepository.getAll() || []).find((p) => p.id === data.id);
    if (!existing) {
      throw new Error('Playlist tidak ditemukan');
    }
    const updated = { ...existing, ...data };
    return playlistRepository.update(updated);
  },

  delete(id: string) {
    const deleted = playlistRepository.delete(id);
    if (!deleted) {
      throw new Error('Gagal menghapus playlist atau ID tidak ditemukan');
    }
    return { message: 'Playlist berhasil dihapus' };
  },
};
