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
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 50));

    // Load mock news data from JSON
    return loadNews();
  }

  async getNewsById(id: string): Promise<NewsItem> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 50));

    // Find news item by id
    const newsList = loadNews();
    const newsItem = newsList.find((item) => item.id === id);

    if (!newsItem) {
      throw new Error(`News item with id ${id} not found`);
    }

    return newsItem;
  }
}
