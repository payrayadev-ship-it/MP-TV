import { runningTextRepository } from '../repositories/runningTextRepository';
import { RunningText } from '../types';

export const runningTextService = {
  getAll(): RunningText[] {
    return runningTextRepository.getAll();
  },

  create(data: Partial<RunningText>): RunningText {
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
    return runningTextRepository.create(newRt);
  },
};
