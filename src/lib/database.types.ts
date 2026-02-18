export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string
          id: string
          model: string
          name: string
          owner_id: string
          status: "idle" | "working" | "training" | "offline"
          system_prompt: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          model?: string
          name: string
          owner_id: string
          status?: "idle" | "working" | "training" | "offline"
          system_prompt?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: string
          name?: string
          owner_id?: string
          status?: "idle" | "working" | "training" | "offline"
          system_prompt?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          id: string
          owner_id: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          owner_id: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          instruction: string
          owner_id: string
          progress: number
          result: Json | null
          status: "pending" | "processing" | "completed" | "failed"
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          instruction: string
          owner_id: string
          progress?: number
          result?: Json | null
          status?: "pending" | "processing" | "completed" | "failed"
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          instruction?: string
          owner_id?: string
          progress?: number
          result?: Json | null
          status?: "pending" | "processing" | "completed" | "failed"
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: unknown
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
