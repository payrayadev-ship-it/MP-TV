import { getState } from '../store';

export const weatherService = {
  getWeather() {
    return {
      data: getState().weather,
      lastSync: new Date().toISOString(),
    };
  },
};
