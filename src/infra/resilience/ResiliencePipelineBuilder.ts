import type { HomeRepository } from '../../domain/home/types';
import { TimeoutRepositoryDecorator } from './TimeoutRepositoryDecorator';
import { RetryRepositoryDecorator } from './RetryRepositoryDecorator';
import { CircuitBreakerRepositoryDecorator } from './CircuitBreakerRepositoryDecorator';
import type { BackoffStrategy } from './backoff/BackoffStrategy';
import { ExponentialBackoff } from './backoff/BackoffStrategy';

export class ResiliencePipelineBuilder {
  private withTimeoutMs?: number;
  private withBreaker?: { failures: number; cooldownMs: number };
  private withRetry?: { retries: number; backoff: BackoffStrategy };

  timeout(ms: number) {
    this.withTimeoutMs = ms;
    return this;
  }

  circuitBreaker(failures: number, cooldownMs: number) {
    this.withBreaker = { failures, cooldownMs };
    return this;
  }

  retry(retries: number, backoff?: BackoffStrategy) {
    this.withRetry = { retries, backoff: backoff ?? new ExponentialBackoff(300, 2) };
    return this;
  }

  build<T extends HomeRepository>(base: T): T {
    let repo: HomeRepository = base;
    if (this.withTimeoutMs != null) {
      repo = new TimeoutRepositoryDecorator(repo, this.withTimeoutMs);
    }
    if (this.withRetry) {
      repo = new RetryRepositoryDecorator(repo, this.withRetry.retries, this.withRetry.backoff);
    }
    if (this.withBreaker) {
      repo = new CircuitBreakerRepositoryDecorator(
        repo,
        this.withBreaker.failures,
        this.withBreaker.cooldownMs,
      );
    }
    return repo as T;
  }
}
