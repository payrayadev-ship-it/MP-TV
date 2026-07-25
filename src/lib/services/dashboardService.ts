import { getDashboardData } from '../store';

export const dashboardService = {
  getDashboard() {
    return getDashboardData();
  },
};
