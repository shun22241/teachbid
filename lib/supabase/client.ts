import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not set');
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  
  if (!supabaseAnonKey) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }
  
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}

// Backwards compatibility export
export const supabase = createClient()