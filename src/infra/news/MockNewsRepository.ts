import type { NewsItem, NewsRepository } from '../../domain/news/types';
import { loadNews } from '../../mock';

/**
 * Mock News Repository
 *
 * This repository loads news data from news.json in src/mock/
 * allowing us to maintain mock data separately and gradually
 * transition to real API integration.
 */
export class MockNewsRepository implements NewsRepository {
  async getNewsList(): Promise<NewsItem[]> {
    await new Promise((r) => setTimeout(r, 50));
    return loadNews();
  }

  async getNewsById(id: string): Promise<NewsItem> {
    await new Promise((r) => setTimeout(r, 50));

    const newsList = loadNews();
    const newsItem = newsList.find((item) => item.id === id);

    if (!newsItem) {
      throw new Error(`News item with id ${id} not found`);
    }

    return newsItem;
  }
}
