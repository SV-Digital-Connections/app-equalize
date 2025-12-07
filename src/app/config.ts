/**
 * App Configuration
 *
 * Centralized configuration to control data sources and API integration.
 * Switch between mock data (JSON files) and real API endpoints.
 */

export type RepoKind = 'mock' | 'remote';

export type AppConfig = {
  /**
   * Data source mode:
   * - 'mock': Use local JSON files from src/mock/*.json
   * - 'remote': Use real API integration via HTTP requests
   *
   * Default: 'mock'
   */
  repoKind: RepoKind;

  /**
   * Base URL for API endpoints (used when repoKind = 'remote')
   */
  apiBaseUrl: string;

  /**
   * Optional API authentication token
   * Set this if your API requires Bearer token authentication
   */
  apiToken?: string;
};

/**
 * Main app configuration
 *
 * To switch from mock to real API:
 * 1. Change repoKind to 'remote'
 * 2. Set the correct apiBaseUrl
 * 3. Add apiToken if API requires authentication
 */
export const config: AppConfig = {
  repoKind: 'remote',
  apiBaseUrl: 'https://jornada.draalinevieiraequalize.com.br',
  apiToken: undefined,
};

/**
 * Helper function to check if app is using mock data
 */
export const isMockMode = () => config.repoKind === 'mock';

/**
 * Helper function to check if app is using real API
 */
export const isRemoteMode = () => config.repoKind === 'remote';
