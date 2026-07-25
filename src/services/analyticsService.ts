import { analyticsRepository } from '../repositories/analyticsRepository';

export const analyticsService = {
  getAnalytics() {
    return analyticsRepository.getAnalytics();
  },
};
