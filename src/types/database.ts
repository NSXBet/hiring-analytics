export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          cod: string;
          role: string;
          status: string;
          recruiter: string;
          hiring_manager: string;
          director: string;
          country: string;
          cost_center: string;
          squad: string | null;
          level: string | null;
          opening_date: string | null;
          closing_date: string | null;
          committed_date: string | null;
          gender: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cod: string;
          role: string;
          status: string;
          recruiter: string;
          hiring_manager: string;
          director: string;
          country: string;
          cost_center: string;
          squad?: string | null;
          level?: string | null;
          opening_date?: string | null;
          closing_date?: string | null;
          committed_date?: string | null;
          gender?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cod?: string;
          role?: string;
          status?: string;
          recruiter?: string;
          hiring_manager?: string;
          director?: string;
          country?: string;
          cost_center?: string;
          squad?: string | null;
          level?: string | null;
          opening_date?: string | null;
          closing_date?: string | null;
          committed_date?: string | null;
          gender?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
