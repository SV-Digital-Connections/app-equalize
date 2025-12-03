/**
 * Domain types for News feature
 */

export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  date: string;
  content: string;
}

export interface NewsRepository {
  getNewsList(): Promise<NewsItem[]>;
  getNewsById(id: string): Promise<NewsItem>;
}
