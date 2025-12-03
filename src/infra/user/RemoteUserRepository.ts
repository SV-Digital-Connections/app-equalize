import type { User, PatientProfile, UserRepository } from '../../domain/user/types';

/**
 * Remote User Repository
 *
 * Handles user and profile data from API
 * Endpoints:
 * - GET /api/me - User data
 * - GET /api/profile - Patient profile data
 */
export class RemoteUserRepository implements UserRepository {
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

  async getMe(): Promise<User> {
    const url = `${this.baseUrl}/api/me`;
    console.log('[RemoteUserRepo] 👤 Fetching user data from:', url);
    console.log('[RemoteUserRepo] 🔑 Auth token (first 30 chars):', this.authToken?.substring(0, 30));

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      console.log('[RemoteUserRepo] Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.log('[RemoteUserRepo] ❌ Error:', errorText);
        throw new Error(`Get user error: ${res.status}`);
      }

      const json = (await res.json()) as User;
      console.log('[RemoteUserRepo] ✅ User data received:', json);
      return json;
    } catch (error) {
      console.log('[RemoteUserRepo] 💥 Fetch error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<PatientProfile> {
    const url = `${this.baseUrl}/api/profile`;
    console.log('[RemoteUserRepo] 🏥 Fetching patient profile from:', url);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      console.log('[RemoteUserRepo] Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.log('[RemoteUserRepo] ❌ Error:', errorText);
        throw new Error(`Get profile error: ${res.status}`);
      }

      const json = (await res.json()) as PatientProfile;
      console.log('[RemoteUserRepo] ✅ Patient profile received:', json);
      return json;
    } catch (error) {
      console.log('[RemoteUserRepo] 💥 Fetch error:', error);
      throw error;
    }
  }
}
