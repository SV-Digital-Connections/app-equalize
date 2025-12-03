import type { EvolutionData, EvolutionRepository } from '../../domain/evolution/types';
import { log } from '../../utils/log';

/**
 * Remote Evolution Repository
 *
 * Handles patient evolution data from API
 * Endpoint: GET /api/evolucao
 */
export class RemoteEvolutionRepository implements EvolutionRepository {
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

  async getEvolution(): Promise<EvolutionData> {
    const url = `${this.baseUrl}/api/evolucao`;
    log.info('[RemoteEvolutionRepo] 📈 Fetching evolution from:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        log.error('[RemoteEvolutionRepo] Error:', errorText);
        throw new Error(`Get evolution error: ${res.status}`);
      }

      const json = (await res.json()) as EvolutionData;
      log.info('[RemoteEvolutionRepo] Evolution data received');
      return json;
    } catch (error) {
      log.error('[RemoteEvolutionRepo] Fetch error:', error);
      throw error;
    }
  }
}
