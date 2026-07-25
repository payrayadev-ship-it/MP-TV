import { getState } from '../store';
import { RunningText } from '../../types';

export const runningTextService = {
  getAll() {
    return getState().runningTexts;
  },

  create(data: Partial<RunningText>) {
    const store = getState();
    const newRt: RunningText = {
      id: `rt-${Date.now()}`,
      text: data.text || 'Running text baru Majalengka Post TV',
      category: data.category || 'Berita',
      speed: data.speed || 'medium',
      fontSize: data.fontSize || 22,
      color: data.color || '#FFFFFF',
      backgroundColor: data.backgroundColor || '#D50000',
      position: data.position || 'bottom',
      active: data.active ?? true,
      autoSyncFromNews: data.autoSyncFromNews ?? true,
      createdAt: new Date().toISOString(),
    };
    if (newRt.active) {
      store.runningTexts.forEach((rt) => (rt.active = false));
    }
    store.runningTexts.unshift(newRt);
    return newRt;
  },
};
