import { dashboardRepository } from '../repositories/dashboardRepository';

export const dashboardService = {
  getDashboard() {
    return dashboardRepository.getDashboardData();
  },
};
