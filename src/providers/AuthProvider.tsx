import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthCredentials, AuthResponse } from '../domain/auth/types';
import type { User } from '../domain/user/types';
import { RemoteAuthRepository } from '../infra/auth/RemoteAuthRepository';
import { RemoteUserRepository } from '../infra/user/RemoteUserRepository';
import { config } from '../app/config';
import { log } from '../utils/log';

const inMemoryStorage = {
  token: null as string | null,
  user: null as User | null,
};

interface AuthContextData {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(inMemoryStorage.token);
  const [user, setUser] = useState<User | null>(inMemoryStorage.user);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: AuthCredentials) => {
    try {
      setIsLoading(true);

      const authRepo = new RemoteAuthRepository(config.apiBaseUrl, () => token ?? undefined);

      const authResponse: AuthResponse = await authRepo.login(credentials);
      log.info('Auth response token_type:', authResponse.token_type);
      log.info('Auth response token (first 20 chars):', authResponse.token?.substring(0, 20));

      const fullToken = authResponse.token_type
        ? `${authResponse.token_type} ${authResponse.token}`
        : `Bearer ${authResponse.token}`;

      log.info('Formatted token for header:', fullToken.substring(0, 30) + '...');

      inMemoryStorage.token = fullToken;
      setToken(fullToken);

      const userRepo = new RemoteUserRepository(config.apiBaseUrl, fullToken);
      const userData = await userRepo.getMe();

      inMemoryStorage.user = userData;
      setUser(userData);

      log.info('Login successful, user:', userData.email);
    } catch (error) {
      log.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const logout = useCallback(async () => {
    try {
      if (token) {
        const authRepo = new RemoteAuthRepository(config.apiBaseUrl, () => token ?? undefined);
        await authRepo.logout();
      }
    } catch (error) {
      log.warn('Logout API call failed (non-critical):', error);
    } finally {
      inMemoryStorage.token = null;
      inMemoryStorage.user = null;
      setToken(null);
      setUser(null);
      log.info('Logged out');
    }
  }, [token]);

  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const userRepo = new RemoteUserRepository(config.apiBaseUrl, token);
      const userData = await userRepo.getMe();
      inMemoryStorage.user = userData;
      setUser(userData);
      log.info('User data refreshed');
    } catch (error) {
      log.error('Error refreshing user:', error);
      throw error;
    }
  }, [token]);

  const value: AuthContextData = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
