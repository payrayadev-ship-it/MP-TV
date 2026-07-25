import { getState } from '../store';
import { NewsArticle } from '../../types';
import { fetchNewsFromSupabase, syncNewsToSupabase } from '../supabase';

export const newsService = {
  async getAll() {
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
    return getState().news;
  },

  async create(data: Partial<NewsArticle>) {
    const store = getState();
    const newArticle: NewsArticle = {
      id: `news-${Date.now()}`,
      title: data.title || 'Judul Berita Majalengka',
      content: data.content || 'Isi berita terkini dari Majalengka Post TV.',
      category: data.category || 'Berita',
      author: data.author || 'Reporter MPTV',
      isBreaking: data.isBreaking || false,
      createdAt: new Date().toISOString(),
      status: data.status || 'Published',
    };
    store.news.unshift(newArticle);

    // Sync to Supabase in background
    syncNewsToSupabase(store.news).catch((err) =>
      console.warn('[NewsService] Supabase sync skipped:', err)
    );

    return newArticle;
  },
};
