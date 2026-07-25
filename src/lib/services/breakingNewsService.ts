import { getState } from '../store';
import { BreakingNews } from '../../types';

export const breakingNewsService = {
  getAll() {
    return getState().breakingNews;
  },

  create(data: {
    title?: string;
    content?: string;
    priority?: any;
    durationSeconds?: number;
    autoTriggerObs?: boolean;
  }) {
    const store = getState();
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

    store.breakingNews.forEach((bn) => (bn.active = false));
    store.breakingNews.unshift(newBn);

    if (newBn.autoTriggerObs) {
      store.previousSceneBeforeBreaking = store.obsSettings.currentScene;
      store.obsSettings.currentScene = 'Studio Utama - Newscast';
    }

    return newBn;
  },
};
