/**
 * Domain types for Media (patient photos)
 */

export interface MediaItem {
  id: number;
  patient_id: number;
  url: string;
  type?: string;
  category?: string;
  date?: string;
  description?: string;
  [key: string]: any;
}

export interface MediaRepository {
  getMedia(): Promise<MediaItem[]>;
}
