import { getState } from '../store';
import { AppSettings } from '../../types';

export const settingsService = {
  getSettings() {
    return getState().settings;
  },

  update(data: Partial<AppSettings>) {
    const store = getState();
    store.settings = { ...store.settings, ...data };
    return store.settings;
  },
};
