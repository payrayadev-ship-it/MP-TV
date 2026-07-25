import { getState } from '../lib/store';
import { AppSettings } from '../types';

export const settingsRepository = {
  getSettings(): AppSettings {
    return getState().settings;
  },

  update(settings: Partial<AppSettings>): AppSettings {
    const store = getState();
    store.settings = { ...store.settings, ...settings };
    return store.settings;
  },
};
