import { getState } from '../lib/store';
import { BreakingNews } from '../types';

export const breakingNewsRepository = {
  getAll(): BreakingNews[] {
    return getState().breakingNews;
  },

  create(item: BreakingNews): BreakingNews {
    const store = getState();
    store.breakingNews.forEach((bn) => (bn.active = false));
    store.breakingNews.unshift(item);
    return item;
  },
};
