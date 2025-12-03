import type { NewsItem, NewsRepository } from '../../domain/news/types';

/**
 * Remote News Repository
 *
 * Integrates with the real API endpoints for news data.
 * Endpoints:
 * - GET /api/noticias - list all news
 * - GET /api/noticias/{id} - get news details by id
 */
export class RemoteNewsRepository implements NewsRepository {
  constructor(
    private readonly baseUrl: string,
    private readonly authToken?: string,
  ) {}

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = this.authToken;
    }
    return headers;
  }

  async getNewsList(): Promise<NewsItem[]> {
    const url = `${this.baseUrl}/api/noticias`;
    console.log('[RemoteNewsRepo] 🌐 Fetching from:', url);
    console.log('[RemoteNewsRepo] Headers:', this.getHeaders());
    
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      console.log('[RemoteNewsRepo] Response status:', res.status, res.statusText);
      console.log('[RemoteNewsRepo] Response headers:', Object.fromEntries(res.headers.entries()));
      
      // Verificar content-type
      const contentType = res.headers.get('content-type');
      console.log('[RemoteNewsRepo] Content-Type:', contentType);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('[RemoteNewsRepo] ❌ Error response body:', errorText);
        throw new Error(`News list API error: ${res.status} - ${errorText}`);
      }

      // Ler resposta como texto primeiro para debug
      const responseText = await res.text();
      console.log('[RemoteNewsRepo] 📄 Raw response (first 500 chars):', responseText.substring(0, 500));
      
      // Verificar se é JSON mesmo
      if (!contentType?.includes('application/json')) {
        console.log('[RemoteNewsRepo] ⚠️ WARNING: Response is not JSON! Content-Type:', contentType);
        console.log('[RemoteNewsRepo] Full response:', responseText);
        throw new Error(`API returned ${contentType} instead of JSON. This usually means the endpoint doesn't exist or returned an error page.`);
      }

      const json = JSON.parse(responseText) as NewsItem[];
      console.log('[RemoteNewsRepo] ✅ Received data:', json);
      return json;
    } catch (error) {
      console.log('[RemoteNewsRepo] 💥 Fetch error:', error);
      throw error;
    }
  }

  async getNewsById(id: string): Promise<NewsItem> {
    const url = `${this.baseUrl}/api/noticias/${id}`;
    console.log('[RemoteNewsRepo] 🌐 Fetching news detail from:', url);
    
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      console.log('[RemoteNewsRepo] Response status:', res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('[RemoteNewsRepo] ❌ Error response body:', errorText);
        throw new Error(`News detail API error: ${res.status} - ${errorText}`);
      }
      
      const json = (await res.json()) as NewsItem;
      console.log('[RemoteNewsRepo] ✅ Received news detail:', json);
      return json;
    } catch (error) {
      console.log('[RemoteNewsRepo] 💥 Fetch error:', error);
      throw error;
    }
  }
}
