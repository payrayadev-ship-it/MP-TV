import { getState } from '../store';
import { Playlist } from '../../types';

export const playlistService = {
  getAll() {
    return getState().playlists;
  },

  create(name?: string, category?: any) {
    const store = getState();
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
    store.playlists.push(newPl);
    return newPl;
  },

  update(data: Partial<Playlist> & { id: string }) {
    const store = getState();
    const index = store.playlists.findIndex((p) => p.id === data.id);
    if (index === -1) {
      throw new Error('Playlist tidak ditemukan');
    }
    const current = store.playlists[index];
    const updated = {
      ...current,
      ...data,
    };
    if (data.active) {
      store.playlists.forEach((p) => (p.active = p.id === data.id));
      store.activePlaylistId = data.id;
    }
    store.playlists[index] = updated;
    return updated;
  },

  delete(id: string) {
    const store = getState();
    store.playlists = store.playlists.filter((p) => p.id !== id);
    return { message: 'Playlist berhasil dihapus' };
  },
};
