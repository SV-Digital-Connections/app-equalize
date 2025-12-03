import type { ResultDetail, ResultsRepository } from '../../domain/results/types';
import { log } from '../../utils/log';

/**
 * Remote Results Repository
 *
 * Handles trail results from API
 * Endpoints:
 * - GET /api/resultados - list all
 * - GET /api/resultados/{id} - get details
 */
export class RemoteResultsRepository implements ResultsRepository {
  constructor(
    private readonly baseUrl: string,
    private readonly authToken?: string,
  ) {}

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = this.authToken;
    }
    return headers;
  }

  async getResults(): Promise<ResultDetail[]> {
    const url = `${this.baseUrl}/api/resultados`;
    log.info('[RemoteResultsRepo] 📊 Fetching results from:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        log.error('[RemoteResultsRepo] Error:', errorText);
        throw new Error(`Get results error: ${res.status}`);
      }

      const json = (await res.json()) as ResultDetail[];
      log.info('[RemoteResultsRepo] Results received, count:', json.length);
      return json;
    } catch (error) {
      log.error('[RemoteResultsRepo] Fetch error:', error);
      throw error;
    }
  }

  async getResultById(id: string): Promise<ResultDetail> {
    const url = `${this.baseUrl}/api/resultados/${id}`;
    log.info('[RemoteResultsRepo] 📊 Fetching result detail from:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        log.error('[RemoteResultsRepo] Error:', errorText);
        throw new Error(`Get result detail error: ${res.status}`);
      }

      const json = (await res.json()) as ResultDetail;
      log.info('[RemoteResultsRepo] Result detail received:', json.id);
      return json;
    } catch (error) {
      log.error('[RemoteResultsRepo] Fetch error:', error);
      throw error;
    }
  }
}
