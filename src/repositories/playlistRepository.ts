import { getState } from '../lib/store';
import { Playlist } from '../types';

export const playlistRepository = {
  getAll(): Playlist[] {
    return getState().playlists;
  },

  create(playlist: Playlist): Playlist {
    getState().playlists.push(playlist);
    return playlist;
  },

  update(playlist: Playlist): Playlist {
    const store = getState();
    const index = store.playlists.findIndex((p) => p.id === playlist.id);
    if (index !== -1) {
      if (playlist.active) {
        store.playlists.forEach((p) => (p.active = p.id === playlist.id));
        store.activePlaylistId = playlist.id;
      }
      store.playlists[index] = playlist;
    }
    return playlist;
  },

  delete(id: string): boolean {
    const store = getState();
    const initialLen = store.playlists.length;
    store.playlists = store.playlists.filter((p) => p.id !== id);
    return store.playlists.length < initialLen;
  },
};
