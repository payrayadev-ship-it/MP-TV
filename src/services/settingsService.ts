import { settingsRepository } from '../repositories/settingsRepository';
import { AppSettings } from '../types';

export const settingsService = {
  getSettings(): AppSettings {
    return settingsRepository.getSettings();
  },

  update(data: Partial<AppSettings>): AppSettings {
    return settingsRepository.update(data);
  },
};
