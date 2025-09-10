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
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: string
          school_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: string
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: string
          school_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          domain: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string
          school_id: string | null
          settings: Json
          student_info_fields: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          creator_id: string
          school_id?: string | null
          settings?: Json
          student_info_fields?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          creator_id?: string
          school_id?: string | null
          settings?: Json
          student_info_fields?: Json
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          content: Json
          question_type: string
          time_limit: number | null
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          content: Json
          question_type: string
          time_limit?: number | null
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          content?: Json
          question_type?: string
          time_limit?: number | null
          points?: number
          created_at?: string
        }
      }
      quiz_sessions: {
        Row: {
          id: string
          quiz_id: string
          host_id: string
          session_code: string
          status: string
          current_question_index: number
          started_at: string | null
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          host_id: string
          session_code: string
          status?: string
          current_question_index?: number
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          host_id?: string
          session_code?: string
          status?: string
          current_question_index?: number
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          session_id: string
          participant_name: string
          participant_data: Json
          status: string
          total_score: number
          joined_at: string
          last_activity: string | null
        }
        Insert: {
          id?: string
          session_id: string
          participant_name: string
          participant_data?: Json
          status?: string
          total_score?: number
          joined_at?: string
          last_activity?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          participant_name?: string
          participant_data?: Json
          status?: string
          total_score?: number
          joined_at?: string
          last_activity?: string | null
        }
      }
      responses: {
        Row: {
          id: string
          participant_id: string
          question_id: string
          answer: Json
          is_correct: boolean
          points_awarded: number
          response_time_ms: number
          submitted_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          question_id: string
          answer: Json
          is_correct?: boolean
          points_awarded?: number
          response_time_ms?: number
          submitted_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          question_id?: string
          answer?: Json
          is_correct?: boolean
          points_awarded?: number
          response_time_ms?: number
          submitted_at?: string
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

// Helper types for common use cases
export type User = Database['public']['Tables']['users']['Row']
export type School = Database['public']['Tables']['schools']['Row']
export type Quiz = Database['public']['Tables']['quizzes']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type QuizSession = Database['public']['Tables']['quiz_sessions']['Row']
export type Participant = Database['public']['Tables']['participants']['Row']
export type Response = Database['public']['Tables']['responses']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type SchoolInsert = Database['public']['Tables']['schools']['Insert']
export type QuizInsert = Database['public']['Tables']['quizzes']['Insert']
export type QuestionInsert = Database['public']['Tables']['questions']['Insert']
export type QuizSessionInsert = Database['public']['Tables']['quiz_sessions']['Insert']
export type ParticipantInsert = Database['public']['Tables']['participants']['Insert']
export type ResponseInsert = Database['public']['Tables']['responses']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type SchoolUpdate = Database['public']['Tables']['schools']['Update']
export type QuizUpdate = Database['public']['Tables']['quizzes']['Update']
export type QuestionUpdate = Database['public']['Tables']['questions']['Update']
export type QuizSessionUpdate = Database['public']['Tables']['quiz_sessions']['Update']
export type ParticipantUpdate = Database['public']['Tables']['participants']['Update']
export type ResponseUpdate = Database['public']['Tables']['responses']['Update']

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Auth types
export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  role?: string
  school_id?: string
}

// Quiz and Session types
export interface QuizSettings {
  allowAnonymousParticipants?: boolean
  showCorrectAnswers?: boolean
  timeLimit?: number
  maxParticipants?: number
  autoAdvance?: boolean
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
}

export interface StudentInfoFields {
  name: boolean
  email?: boolean
  class?: boolean
  division?: boolean
  rollNumber?: boolean
  customFields?: Array<{
    name: string
    type: 'text' | 'number' | 'select'
    required: boolean
    options?: string[]
  }>
}

export interface QuestionContent {
  question: string
  options?: string[]
  correctAnswer?: string | number
  explanation?: string
  media?: {
    type: 'image' | 'video' | 'audio'
    url: string
    alt?: string
  }
}

export interface ParticipantData {
  class?: string
  division?: string
  rollNumber?: string
  [key: string]: any
}

export interface ResponseAnswer {
  selected?: string | number
  text?: string
  multiple?: string[] | number[]
  [key: string]: any
}

// Real-time event types
export interface RealtimeEvent<T = any> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new?: T
  old?: T
  errors?: string[]
}

// Error types
export interface BeaconIQError extends Error {
  code?: string
  status?: number
  details?: any
}

// Session status types
export type SessionStatus = 'waiting' | 'active' | 'paused' | 'completed'
export type ParticipantStatus = 'connected' | 'disconnected' | 'struggling'
export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student'
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'
