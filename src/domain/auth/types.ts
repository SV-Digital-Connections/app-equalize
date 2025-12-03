/**
 * Domain types for Authentication
 */

export interface AuthCredentials {
  email: string;
  password: string;
  device_name: string;
}

export interface AuthResponse {
  token: string;
  token_type?: string;
  status?: 'success' | 'error';
  message?: string;
}

export interface AuthRepository {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
}
