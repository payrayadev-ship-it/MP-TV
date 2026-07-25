import { newsRepository } from '../repositories/newsRepository';
import { NewsArticle } from '../types';

export const newsService = {
  async getAll(): Promise<NewsArticle[]> {
    return newsRepository.getAll();
  },

  async create(data: Partial<NewsArticle>): Promise<NewsArticle> {
    const article: NewsArticle = {
      id: `news-${Date.now()}`,
      title: data.title || 'Judul Berita Majalengka',
      content: data.content || 'Isi berita terkini dari Majalengka Post TV.',
      category: data.category || 'Berita',
      author: data.author || 'Reporter MPTV',
      isBreaking: data.isBreaking || false,
      createdAt: new Date().toISOString(),
      status: data.status || 'Published',
    };
    return newsRepository.create(article);
  },
};
