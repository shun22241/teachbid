import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Request = Database['public']['Tables']['requests']['Row']
export type Proposal = Database['public']['Tables']['proposals']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// Extended types with relations
export interface RequestWithRelations extends Request {
  profiles: Pick<Profile, 'display_name' | 'avatar_url'>
  proposals?: {
    count: number
  }[]
  _count?: {
    proposals: number
  }
}

export interface ProposalWithRelations extends Proposal {
  profiles: Profile
  requests?: Request
}

export interface TransactionWithRelations extends Transaction {
  student: Profile
  teacher: Profile
  requests: Request
  proposals: Proposal
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: Error | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// Form types
export interface RequestFormData {
  title: string
  category: string
  subcategory?: string
  description: string
  learning_goals: string[]
  current_level?: string
  budget_min: number
  budget_max: number
  duration_weeks?: number
  lessons_per_week?: number
  lesson_duration_minutes?: number
  preferred_schedule?: {
    days: string[]
    times: string[]
  }
  deadline?: string
}

export interface ProposalFormData {
  amount: number
  message: string
  lesson_plan: string
  available_schedule?: {
    days: string[]
    times: string[]
  }
  sample_materials?: string[]
  guarantee_terms?: string
}

// Filter types
export interface RequestFilters {
  category?: string
  status?: Request['status']
  budgetMin?: number
  budgetMax?: number
  sortBy?: 'created_at' | 'budget_max' | 'deadline'
  sortOrder?: 'asc' | 'desc'
}

export interface ProposalFilters {
  status?: Proposal['status']
  sortBy?: 'amount' | 'created_at' | 'rating'
  sortOrder?: 'asc' | 'desc'
}