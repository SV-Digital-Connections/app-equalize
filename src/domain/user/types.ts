/**
 * Domain types for User and Profile
 */

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface PatientProfile {
  id: number;
  user_id: number;
  name: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  [key: string]: any; // Para campos adicionais que possam vir da API
}

export interface UserRepository {
  getMe(): Promise<User>;
  getProfile(): Promise<PatientProfile>;
}
