/**
 * Example Home API Service using HttpClient
 *
 * This demonstrates how to create API services using the HttpClient.
 * Replace the mock data with real API calls when integrating.
 */

import { getHttpClient } from '../infra/http';
import type { HttpResponse } from '../infra/http';
import type { HomeData, UpcomingProcedure, NewsItem, ResultItem } from '../domain/home/types';

// API Response Types (match your backend API)
export type UpcomingProcedureDTO = {
  dateLabel: string;
  name: string;
};

export type NewsItemDTO = {
  title: string;
  subtitle: string;
  imageUrl: string;
};

export type ResultItemDTO = {
  imageUrl: string;
};

export type HomeDataDTO = {
  upcoming: UpcomingProcedureDTO;
  news: NewsItemDTO[];
  results: ResultItemDTO[];
  unreadCount: number;
};

/**
 * Fetch home data from API
 *
 * @returns Promise with home data
 * @throws HttpError if request fails
 */
export async function getHomeData(): Promise<HomeData> {
  const client = getHttpClient();

  try {
    // Real API call (uncomment when ready)
    // const response: HttpResponse<HomeDataDTO> = await client.get('/home');
    // return mapHomeDataFromDTO(response.data);

    // Mock implementation for now
    await new Promise((r) => setTimeout(r, 500));
    return {
      upcoming: { dateLabel: '25 de agosto', name: 'Fio Silhouett' },
      hero: {
        imageUri: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop',
        videoUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      news: [
        {
          title: 'Chegou nova onda de calor, como proceder',
          subtitle: 'Confira aqui 10 dicas de cuidados com seus procedimentos',
          imageUrl:
            'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200&q=60&auto=format&fit=crop',
        },
      ],
      results: [
        {
          id: '1',
          imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=60&auto=format&fit=crop',
          title: 'Resultado 1',
          date: '01/01/2025',
          category: 'Facial',
        },
      ],
      unreadCount: 3,
      care: [],
      regeneration: [],
      maintenance: [],
      messages: [],
    };
  } catch (error) {
    // Handle error (already logged by HttpClient)
    throw error;
  }
}

/**
 * Map DTO to Domain model
 * Use this when you have real API responses
 */
function mapHomeDataFromDTO(dto: HomeDataDTO): HomeData {
  return {
    upcoming: {
      dateLabel: dto.upcoming.dateLabel,
      name: dto.upcoming.name,
    },
    hero: {
      imageUri: '',
      videoUri: '',
    },
    news: dto.news.map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
    })),
    results: dto.results.map((item, index) => ({
      id: String(index + 1),
      imageUrl: item.imageUrl,
      title: '',
      date: '',
      category: '',
    })),
    unreadCount: dto.unreadCount,
    care: [],
    regeneration: [],
    maintenance: [],
    messages: [],
  };
}

// Example: Other API endpoints you might need

/**
 * Fetch news by ID
 */
export async function getNewsById(id: string): Promise<NewsItem> {
  const client = getHttpClient();
  const response: HttpResponse<NewsItemDTO> = await client.get(`/news/${id}`);
  return response.data;
}

/**
 * Fetch all results
 */
export async function getResults(): Promise<ResultItem[]> {
  const client = getHttpClient();
  const response: HttpResponse<ResultItemDTO[]> = await client.get('/results');
  return response.data.map((item, index) => ({
    id: String(index + 1),
    imageUrl: item.imageUrl,
    title: '',
    date: '',
    category: '',
  }));
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  const client = getHttpClient();
  await client.post(`/messages/${messageId}/read`);
}
