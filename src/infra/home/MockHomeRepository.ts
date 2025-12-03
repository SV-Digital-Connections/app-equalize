import type { HomeData, HomeRepository } from '../../domain/home/types';
import { loadAllMockData } from '../../mock';

/**
 * Mock Home Repository
 *
 * This repository loads data from JSON files in src/mock/
 * allowing us to maintain mock data separately and gradually
 * transition to real API integration.
 */
export class MockHomeRepository implements HomeRepository {
  async getHomeData(): Promise<HomeData> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 50));

    // Load all mock data from JSON files
    const mockData = loadAllMockData();

    return mockData;
  }
}
