/**
 * Domain types for Results (trail results)
 */

export interface ResultDetail {
  id: number;
  patient_id: number;
  title: string;
  description?: string;
  image_url?: string;
  date?: string;
  category?: string;
  value?: string | number;
  [key: string]: any;
}

export interface ResultsRepository {
  getResults(): Promise<ResultDetail[]>;
  getResultById(id: string): Promise<ResultDetail>;
}
