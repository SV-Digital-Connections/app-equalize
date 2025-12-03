import type { MediaItem, MediaRepository } from '../../domain/media/types';
import { log } from '../../utils/log';

/**
 * Remote Media Repository
 *
 * Handles patient media from API
 * Endpoint: GET /api/media
 */
export class RemoteMediaRepository implements MediaRepository {
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

  async getMedia(): Promise<MediaItem[]> {
    const url = `${this.baseUrl}/api/media`;
    log.info('[RemoteMediaRepo] 📸 Fetching media from:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        log.error('[RemoteMediaRepo] Error:', errorText);
        throw new Error(`Get media error: ${res.status}`);
      }

      const json = (await res.json()) as MediaItem[];
      log.info('[RemoteMediaRepo] Media received, count:', json.length);
      return json;
    } catch (error) {
      log.error('[RemoteMediaRepo] Fetch error:', error);
      throw error;
    }
  }
}
