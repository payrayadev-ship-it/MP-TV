import { getState } from '../store';
import { ScheduleItem } from '../../types';

export const scheduleService = {
  getAll() {
    return getState().schedules;
  },

  create(data: Partial<ScheduleItem>) {
    const store = getState();
    const newSch: ScheduleItem = {
      id: `sch-${Date.now()}`,
      programTitle: data.programTitle || 'Program Siaran Majalengka TV',
      playlistId: data.playlistId || 'pl-1',
      obsSceneId: data.obsSceneId || 'sc-1',
      date: data.date || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '12:00',
      endTime: data.endTime || '13:00',
      recurring: data.recurring || 'Daily',
      active: data.active ?? true,
      category: data.category || 'Berita',
    };
    store.schedules.push(newSch);
    return newSch;
  },
};
