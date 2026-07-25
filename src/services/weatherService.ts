import { weatherRepository } from '../repositories/weatherRepository';

export const weatherService = {
  getWeather() {
    return {
      data: weatherRepository.getWeather(),
      lastSync: new Date().toISOString(),
    };
  },
};
