export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          credits: number | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          credits?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          credits?: number | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          target_audience: string | null
          selling_points: Json | null
          original_image_url: string | null
          generated_image_url: string | null
          thumbnail_url: string | null
          template_html: string | null
          long_form: Json | null
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_audience?: string | null
          selling_points?: Json | null
          original_image_url?: string | null
          generated_image_url?: string | null
          thumbnail_url?: string | null
          template_html?: string | null
          long_form?: Json | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          target_audience?: string | null
          selling_points?: Json | null
          original_image_url?: string | null
          generated_image_url?: string | null
          thumbnail_url?: string | null
          template_html?: string | null
          long_form?: Json | null
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
