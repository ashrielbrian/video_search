export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      segment: {
        Row: {
          created_at: string | null
          end_time: number | null
          id: number
          start_time: number | null
          text: string
          tokens: number[] | null
          video_id: string
        }
        Insert: {
          created_at?: string | null
          end_time?: number | null
          id: number
          start_time?: number | null
          text: string
          tokens?: number[] | null
          video_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: number | null
          id?: number
          start_time?: number | null
          text?: string
          tokens?: number[] | null
          video_id?: string
        }
      }
      segment_embedding: {
        Row: {
          embedding: string
          id: number
          video_id: string
        }
        Insert: {
          embedding: string
          id: number
          video_id: string
        }
        Update: {
          embedding?: string
          id?: number
          video_id?: string
        }
      }
      video: {
        Row: {
          channel_id: string | null
          channel_title: string | null
          created_at: string | null
          description: string | null
          id: string
          playlist_id: string | null
          thumbnail: string | null
          title: string
          transcription: string | null
        }
        Insert: {
          channel_id?: string | null
          channel_title?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          playlist_id?: string | null
          thumbnail?: string | null
          title: string
          transcription?: string | null
        }
        Update: {
          channel_id?: string | null
          channel_title?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          playlist_id?: string | null
          thumbnail?: string | null
          title?: string
          transcription?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_segment: {
        Args: {
          query_embedding: string
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          title: string
          playlist_id: string
          channel_title: string
          description: string
          segment_id: number
          content: string
          similarity: number
          start_time: number
          end_time: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
