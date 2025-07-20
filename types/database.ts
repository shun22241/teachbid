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
      profiles: {
        Row: {
          id: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          display_name: string
          avatar_url: string | null
          bio: string | null
          skills: string[] | null
          certifications: string[] | null
          hourly_rate_min: number | null
          hourly_rate_max: number | null
          rating: number
          rating_count: number
          total_earnings: number
          total_spending: number
          is_verified: boolean
          stripe_customer_id: string | null
          stripe_account_id: string | null
          referral_code: string | null
          referred_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'student' | 'teacher' | 'admin'
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          skills?: string[] | null
          certifications?: string[] | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          rating?: number
          rating_count?: number
          total_earnings?: number
          total_spending?: number
          is_verified?: boolean
          stripe_customer_id?: string | null
          stripe_account_id?: string | null
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          role?: 'student' | 'teacher' | 'admin'
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          skills?: string[] | null
          certifications?: string[] | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          rating?: number
          rating_count?: number
          total_earnings?: number
          total_spending?: number
          is_verified?: boolean
          stripe_customer_id?: string | null
          stripe_account_id?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          student_id: string
          title: string
          category: string
          subcategory: string | null
          description: string
          learning_goals: string[]
          current_level: string | null
          budget_min: number
          budget_max: number
          duration_weeks: number | null
          lessons_per_week: number | null
          lesson_duration_minutes: number | null
          preferred_schedule: Json | null
          timezone: string
          deadline: string | null
          status: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
          slug: string
          views: number
          is_urgent: boolean
          urgent_until: string | null
          matched_proposal_id: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          category: string
          subcategory?: string | null
          description: string
          learning_goals: string[]
          current_level?: string | null
          budget_min: number
          budget_max: number
          duration_weeks?: number | null
          lessons_per_week?: number | null
          lesson_duration_minutes?: number | null
          preferred_schedule?: Json | null
          timezone?: string
          deadline?: string | null
          status?: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
          slug: string
          views?: number
          is_urgent?: boolean
          urgent_until?: string | null
          matched_proposal_id?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          student_id?: string
          title?: string
          category?: string
          subcategory?: string | null
          description?: string
          learning_goals?: string[]
          current_level?: string | null
          budget_min?: number
          budget_max?: number
          duration_weeks?: number | null
          lessons_per_week?: number | null
          lesson_duration_minutes?: number | null
          preferred_schedule?: Json | null
          timezone?: string
          deadline?: string | null
          status?: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
          slug?: string
          views?: number
          is_urgent?: boolean
          urgent_until?: string | null
          matched_proposal_id?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          meta_title?: string | null
          meta_description?: string | null
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          request_id: string
          teacher_id: string
          amount: number
          message: string
          lesson_plan: string
          available_schedule: Json | null
          sample_materials: string[] | null
          guarantee_terms: string | null
          status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          is_selected: boolean
          rejected_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          teacher_id: string
          amount: number
          message: string
          lesson_plan: string
          available_schedule?: Json | null
          sample_materials?: string[] | null
          guarantee_terms?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          is_selected?: boolean
          rejected_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          request_id?: string
          teacher_id?: string
          amount?: number
          message?: string
          lesson_plan?: string
          available_schedule?: Json | null
          sample_materials?: string[] | null
          guarantee_terms?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
          is_selected?: boolean
          rejected_at?: string | null
          rejection_reason?: string | null
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          request_id: string
          proposal_id: string
          student_id: string
          teacher_id: string
          amount: number
          fee_rate: number
          fee_amount: number
          net_amount: number
          referral_discount: number
          promo_discount: number
          final_amount: number
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          paid_at: string | null
          completed_at: string | null
          refunded_at: string | null
          refund_amount: number | null
          refund_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          proposal_id: string
          student_id: string
          teacher_id: string
          amount: number
          fee_rate: number
          fee_amount: number
          net_amount: number
          referral_discount?: number
          promo_discount?: number
          final_amount: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          paid_at?: string | null
          completed_at?: string | null
          refunded_at?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          request_id?: string
          proposal_id?: string
          student_id?: string
          teacher_id?: string
          amount?: number
          fee_rate?: number
          fee_amount?: number
          net_amount?: number
          referral_discount?: number
          promo_discount?: number
          final_amount?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          paid_at?: string | null
          completed_at?: string | null
          refunded_at?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          updated_at?: string
        }
      }
      categories: {
        Row: {
          slug: string
          name: string
          name_en: string
          description: string
          icon: string
          color: string
          display_order: number
          is_active: boolean
          meta_title: string
          meta_description: string
          meta_keywords: string[] | null
          average_price_min: number | null
          average_price_max: number | null
          popular_skills: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          slug: string
          name: string
          name_en: string
          description: string
          icon: string
          color?: string
          display_order: number
          is_active?: boolean
          meta_title: string
          meta_description: string
          meta_keywords?: string[] | null
          average_price_min?: number | null
          average_price_max?: number | null
          popular_skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          name_en?: string
          description?: string
          icon?: string
          color?: string
          display_order?: number
          is_active?: boolean
          meta_title?: string
          meta_description?: string
          meta_keywords?: string[] | null
          average_price_min?: number | null
          average_price_max?: number | null
          popular_skills?: string[] | null
          updated_at?: string
        }
      }
      revenue_records: {
        Row: {
          id: string
          type: 'fee' | 'urgent_option' | 'boost_option' | 'subscription' | 'referral_bonus'
          amount: number
          user_id: string | null
          transaction_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'fee' | 'urgent_option' | 'boost_option' | 'subscription' | 'referral_bonus'
          amount: number
          user_id?: string | null
          transaction_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          type?: 'fee' | 'urgent_option' | 'boost_option' | 'subscription' | 'referral_bonus'
          amount?: number
          user_id?: string | null
          transaction_id?: string | null
          description?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          transaction_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          is_public?: boolean
          created_at?: string
        }
        Update: {
          transaction_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          is_public?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          link: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          read_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_slug: {
        Args: {
          title: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: 'student' | 'teacher' | 'admin'
      request_status: 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled'
      transaction_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
      proposal_status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
    }
  }
}