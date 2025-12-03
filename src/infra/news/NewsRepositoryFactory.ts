import type { NewsRepository } from '../../domain/news/types';
import { MockNewsRepository } from './MockNewsRepository';
import { RemoteNewsRepository } from './RemoteNewsRepository';
import { FailoverCompositeNewsRepository } from './FailoverCompositeNewsRepository';
import { CircuitOpenPreferMockStrategy } from '../home/strategy/RepositorySelectionStrategy';
import type { AppConfig, RepoKind } from '../../app/config';

export type NewsRepoKind = RepoKind;

export class NewsRepositoryFactory {
  static create(kind: NewsRepoKind, baseUrl: string, authToken?: string): NewsRepository {
    console.log('[NewsRepoFactory] Creating repository, kind:', kind, 'baseUrl:', baseUrl);
    console.log('[NewsRepoFactory] Auth token present?', !!authToken);
    if (kind === 'mock') {
      console.log('[NewsRepoFactory] Returning MockNewsRepository');
      return new MockNewsRepository();
    }
    console.log('[NewsRepoFactory] Creating RemoteNewsRepository with resilience');
    const remote = new RemoteNewsRepository(baseUrl, authToken);
    const composed = composeResilient(remote);
    console.log('[NewsRepoFactory] Composed repository type:', composed.constructor.name);
    return composed;
  }
}

// Separate composition for SRP and reuse/testing
export function composeResilient(primary: NewsRepository): NewsRepository {
  console.log('[NewsRepoFactory] Building resilience - using direct failover (decorators not supported for News yet)');
  const mock = new MockNewsRepository();
  const strategy = new CircuitOpenPreferMockStrategy();
  return new FailoverCompositeNewsRepository(primary, mock, strategy);
}

// Build from app config to enforce DIP at the composition root
export function buildNewsRepositoryFromConfig(cfg: AppConfig): NewsRepository {
  return NewsRepositoryFactory.create(cfg.repoKind, cfg.apiBaseUrl, cfg.apiToken);
}
