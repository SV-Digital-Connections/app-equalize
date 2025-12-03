import type { PontoMelhoria, PontosRepository } from '../../domain/pontos/types';
import { log } from '../../utils/log';

/**
 * Remote Pontos Repository
 *
 * Handles improvement points images from API
 * Endpoints:
 * - GET /api/pontos - list all
 * - GET /api/pontos/{id} - get details
 */
export class RemotePontosRepository implements PontosRepository {
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

  async getPontos(): Promise<PontoMelhoria[]> {
    const url = `${this.baseUrl}/api/pontos`;
    log.info('[RemotePontosRepo] 🎯 Fetching pontos from:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        log.error('[RemotePontosRepo] Error:', errorText);
        throw new Error(`Get pontos error: ${res.status}`);
      }

      const json = (await res.json()) as PontoMelhoria[];
      log.info('[RemotePontosRepo] Pontos received, count:', json.length);
      return json;
    } catch (error) {
      log.error('[RemotePontosRepo] Fetch error:', error);
      throw error;
    }
  }

  async getPontoById(id: string): Promise<PontoMelhoria> {
    const url = `${this.baseUrl}/api/pontos/${id}`;
    log.info('[RemotePontosRepo] 🎯 Fetching ponto detail from:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        log.error('[RemotePontosRepo] Error:', errorText);
        throw new Error(`Get ponto detail error: ${res.status}`);
      }

      const json = (await res.json()) as PontoMelhoria;
      log.info('[RemotePontosRepo] Ponto detail received:', json.id);
      return json;
    } catch (error) {
      log.error('[RemotePontosRepo] Fetch error:', error);
      throw error;
    }
  }
}
