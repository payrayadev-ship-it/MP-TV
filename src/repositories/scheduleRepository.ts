import { getState } from '../lib/store';
import { ScheduleItem } from '../types';

export const scheduleRepository = {
  getAll(): ScheduleItem[] {
    return getState().schedules;
  },

  create(schedule: ScheduleItem): ScheduleItem {
    getState().schedules.push(schedule);
    return schedule;
  },
};
