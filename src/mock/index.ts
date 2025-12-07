/**
 * Mock Data Loader
 *
 * Utility functions to load mock data from JSON files.
 * This allows us to maintain mocks in separate JSON files
 * and gradually transition to real API integration.
 */

import homeData from './home.json';
import newsData from './news.json';
import resultsData from './results.json';
import messagesData from './messages.json';
import careData from './care.json';
import regenerationData from './regeneration.json';
import maintenanceData from './maintenance.json';
import checkupsData from './checkups.json';
import trailData from './trail.json';
import nextStepsData from './nextsteps.json';
import identityData from './identity.json';
import profileData from './profile.json';
import type { Recipe } from '../domain/care/types';

export type MockHomeData = typeof homeData;
export type MockNewsItem = (typeof newsData)[0];
export type MockResultItem = (typeof resultsData)[0];
export type MockMessageItem = (typeof messagesData)[0];
export type MockCareData = typeof careData;
export type MockProcedureItem = (typeof regenerationData.procedures)[0];
export type MockIdentityData = typeof identityData;
export type MockRegenerationData = typeof regenerationData;
export type MockMaintenanceData = typeof maintenanceData;
export type MockCheckupsData = typeof checkupsData;
export type MockTrailData = typeof trailData;
export type MockTrailItem = (typeof trailData.trailItems)[0];
export type MockNextStepsItem = (typeof nextStepsData)[0];
export type MockProfileData = typeof profileData;

/**
 * Load home data (upcoming procedure and unread count)
 */
export function loadHomeData() {
  return homeData;
}

/**
 * Load user data for header (greeting, name, unreadCount)
 */
export function loadUserData() {
  return {
    greeting: homeData.user.greeting,
    name: homeData.user.name,
    unreadCount: homeData.unreadCount,
  };
}

/**
 * Load news items
 */
export function loadNews() {
  return newsData;
}

/**
 * Load a single news item by ID
 */
export function loadNewsById(id: string) {
  return newsData.find((item) => item.id === id);
}

/**
 * Load results/gallery items
 */
export function loadResults() {
  return resultsData;
}

/**
 * Load messages
 */
export function loadMessages() {
  return messagesData;
}

/**
 * Load a single message by ID
 */
export function loadMessageById(id: string) {
  return messagesData.find((item) => item.id === id);
}

/**
 * Load care data (recipes and procedures)
 */
export function loadCareData() {
  return {
    ...careData,
    recipes: careData.recipes as Recipe[],
  };
}

/**
 * Load care procedures only
 */
export function loadCareProcedures() {
  return careData.procedures;
}

/**
 * Load regeneration procedures
 */
export function loadRegenerationProcedures() {
  return regenerationData.procedures;
}

export function loadMaintenanceData() {
  return maintenanceData;
}

export function loadMaintenanceProcedures() {
  return maintenanceData.procedures;
}

export function loadCheckupsData() {
  return checkupsData;
}

export function loadCheckupsProcedures() {
  return checkupsData.procedures;
}

export function loadTrailData() {
  return trailData;
}

export function loadTrailItems() {
  return trailData.trailItems;
}

export function loadNextSteps() {
  return nextStepsData;
}

/**
 * Load regeneration data (full structure with texts and procedures)
 */
export function loadRegenerationData() {
  return regenerationData;
}

/**
 * Load identity/profile data
 */
export function loadIdentityData() {
  return identityData;
}

/**
 * Load profile/account settings data
 */
export function loadProfileData() {
  return profileData;
}

/**
 * Load all data (complete HomeData structure)
 */
export function loadAllMockData() {
  return {
    ...homeData,
    news: newsData.map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
    })),
    results: homeData.featuredResults,
    messages: messagesData,
    care: careData.procedures,
    regeneration: regenerationData.procedures,
    maintenance: maintenanceData.procedures,
    checkups: checkupsData.procedures,
    trail: trailData.trailItems,
  };
}
