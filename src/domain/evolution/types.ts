/**
 * Domain types for Evolution (patient evolution)
 */

export interface EvolutionData {
  patient_id: number;
  timeline?: Array<{
    date: string;
    description: string;
    type?: string;
  }>;
  metrics?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface EvolutionRepository {
  getEvolution(): Promise<EvolutionData>;
}
