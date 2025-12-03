/**
 * Domain types for Pontos (improvement points images)
 */

export interface PontoMelhoria {
  id: number;
  patient_id: number;
  title: string;
  description?: string;
  image_url: string;
  date?: string;
  status?: string;
  [key: string]: any;
}

export interface PontosRepository {
  getPontos(): Promise<PontoMelhoria[]>;
  getPontoById(id: string): Promise<PontoMelhoria>;
}
