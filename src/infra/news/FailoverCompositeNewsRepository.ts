import type { NewsItem, NewsRepository } from '../../domain/news/types';
import { CircuitOpenError } from '../resilience/errors';
import type { RepositorySelectionStrategy } from '../home/strategy/RepositorySelectionStrategy';

export class FailoverCompositeNewsRepository implements NewsRepository {
  constructor(
    private readonly primary: NewsRepository,
    private readonly fallback: NewsRepository,
    private readonly strategy: RepositorySelectionStrategy,
  ) {}

  async getNewsList(): Promise<NewsItem[]> {
    console.log('[NewsRepo] Attempting to get news list from primary');
    console.log('[NewsRepo] Primary type:', this.primary.constructor.name);
    console.log('[NewsRepo] Primary has getNewsList?', typeof this.primary.getNewsList);
    try {
      const result = await this.primary.getNewsList();
      console.log('[NewsRepo] ✅ Success from primary, got', result.length, 'items');
      return result;
    } catch (e) {
      console.log('[NewsRepo] ❌ Primary failed:', e);
      const chosen = this.strategy.pick(this.primary, this.fallback, e);
      if (chosen === this.fallback || e instanceof CircuitOpenError) {
        console.log('[NewsRepo] 🔄 Falling back to mock repository');
        const fallbackResult = await this.fallback.getNewsList();
        console.log('[NewsRepo] ✅ Fallback success, got', fallbackResult.length, 'items');
        return fallbackResult;
      }
      throw e;
    }
  }

  async getNewsById(id: string): Promise<NewsItem> {
    try {
      return await this.primary.getNewsById(id);
    } catch (e) {
      const chosen = this.strategy.pick(this.primary, this.fallback, e);
      if (chosen === this.fallback || e instanceof CircuitOpenError) {
        return await this.fallback.getNewsById(id);
      }
      throw e;
    }
  }
}
