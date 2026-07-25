import { breakingNewsRepository } from '../repositories/breakingNewsRepository';
import { obsService } from './obsService';
import { BreakingNews } from '../types';

export const breakingNewsService = {
  getAll(): BreakingNews[] {
    return breakingNewsRepository.getAll();
  },

  create(data: {
    title?: string;
    content?: string;
    priority?: any;
    durationSeconds?: number;
    autoTriggerObs?: boolean;
  }): BreakingNews {
    const newBn: BreakingNews = {
      id: `bn-${Date.now()}`,
      title: data.title || 'BREAKING NEWS MAJALENGKA',
      content: data.content || 'Informasi mendesak terkini dari Kabupaten Majalengka.',
      priority: data.priority || 'Emergency',
      durationSeconds: data.durationSeconds || 20,
      active: true,
      publishedAt: new Date().toISOString(),
      autoTriggerObs: data.autoTriggerObs ?? true,
    };

    const created = breakingNewsRepository.create(newBn);

    if (created.autoTriggerObs) {
      obsService.changeScene('Studio Utama - Newscast');
    }

    return created;
  },
};
