import { getState } from '../lib/store';
import { WeatherData } from '../types';

export const weatherRepository = {
  getWeather(): WeatherData[] {
    return getState().weather;
  },
};
