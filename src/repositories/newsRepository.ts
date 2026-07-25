import { getState } from '../lib/store';
import { NewsArticle } from '../types';
import { fetchNewsFromSupabase, syncNewsToSupabase } from '../lib/supabase';

export const newsRepository = {
  async getAll(): Promise<NewsArticle[]> {
    try {
      const supabaseData = await fetchNewsFromSupabase();
      if (supabaseData && supabaseData.length > 0) {
        const mapped: NewsArticle[] = supabaseData.map((item: any) => ({
          id: String(item.id),
          title: item.title,
          content: item.content,
          category: item.category,
          author: item.author,
          isBreaking: item.is_breaking || false,
          createdAt: item.published_at || item.created_at,
          status: item.status || 'Published',
        }));
        getState().news = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('[newsRepository] Supabase fetch fallback to local store:', e);
    }
    return getState().news;
  },

  async create(article: NewsArticle): Promise<NewsArticle> {
    const store = getState();
    store.news.unshift(article);
    syncNewsToSupabase(store.news).catch((err) =>
      console.warn('[newsRepository] Supabase sync error:', err)
    );
    return article;
  },
};
