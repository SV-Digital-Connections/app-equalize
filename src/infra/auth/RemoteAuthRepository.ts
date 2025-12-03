import type { AuthCredentials, AuthResponse, AuthRepository } from '../../domain/auth/types';

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
    console.log('[RemoteAuthRepo] 🔐 Logging in:', credentials.email);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('[RemoteAuthRepo] Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.log('[RemoteAuthRepo] ❌ Login failed:', errorText);
        throw new Error(`Login failed: ${res.status} - ${errorText}`);
      }

      const json = (await res.json()) as AuthResponse;
      console.log('[RemoteAuthRepo] 📦 Login response:', JSON.stringify(json, null, 2));

      // Check if API returned error in JSON (even with 200 status)
      if (json.status === 'error' || !json.token) {
        const errorMsg = json.message || 'Login failed';
        console.log('[RemoteAuthRepo] ❌ Login failed:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[RemoteAuthRepo] ✅ Login successful, token received');
      return json;
    } catch (error) {
      console.log('[RemoteAuthRepo] 💥 Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    const url = `${this.baseUrl}/api/logout`;
    const token = this.getToken();

    console.log('[RemoteAuthRepo] 🚪 Logging out');

    if (!token) {
      console.log('[RemoteAuthRepo] ⚠️ No token found, skipping API call');
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

      console.log('[RemoteAuthRepo] Response status:', res.status);

      if (!res.ok) {
        console.log('[RemoteAuthRepo] ⚠️ Logout API error (non-critical):', res.status);
      } else {
        console.log('[RemoteAuthRepo] ✅ Logout successful');
      }
    } catch (error) {
      console.log('[RemoteAuthRepo] ⚠️ Logout error (non-critical):', error);
    }
  }
}
