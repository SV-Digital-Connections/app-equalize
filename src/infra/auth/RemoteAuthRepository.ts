import type { AuthCredentials, AuthResponse, AuthRepository } from '../../domain/auth/types';
import { log } from '../../utils/log';

/**
 * Remote Auth Repository
 *
 * Handles authentication with the API
 * Endpoints:
 * - POST /api/login
 * - GET /api/logout
 */
export class RemoteAuthRepository implements AuthRepository {
  constructor(
    private readonly baseUrl: string,
    private getToken: () => string | undefined,
  ) {}

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const url = `${this.baseUrl}/api/login`;
    log.info('[RemoteAuthRepo] 🔐 Logging in:', credentials.email);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      log.info('[RemoteAuthRepo] Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        log.error('[RemoteAuthRepo] ❌ Login failed:', errorText);
        throw new Error(`Login failed: ${res.status} - ${errorText}`);
      }

      const json = (await res.json()) as AuthResponse;
      log.info('[RemoteAuthRepo] 📦 Login response:', JSON.stringify(json, null, 2));

      if (json.status === 'error' || !json.token) {
        const errorMsg = json.message || 'Login failed';
        log.error('[RemoteAuthRepo] ❌ Login failed:', errorMsg);
        throw new Error(errorMsg);
      }

      log.info('[RemoteAuthRepo] ✅ Login successful, token received');
      return json;
    } catch (error) {
      log.error('[RemoteAuthRepo] 💥 Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    const url = `${this.baseUrl}/api/logout`;
    const token = this.getToken();

    log.info('[RemoteAuthRepo] 🚪 Logging out');

    if (!token) {
      log.warn('[RemoteAuthRepo] ⚠️ No token found, skipping API call');
      return;
    }

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Accept': 'application/json',
        },
      });

      log.info('[RemoteAuthRepo] Response status:', res.status);

      if (!res.ok) {
        log.warn('[RemoteAuthRepo] ⚠️ Logout API error (non-critical):', res.status);
      } else {
        log.info('[RemoteAuthRepo] ✅ Logout successful');
      }
    } catch (error) {
      log.warn('[RemoteAuthRepo] ⚠️ Logout error (non-critical):', error);
    }
  }
}
