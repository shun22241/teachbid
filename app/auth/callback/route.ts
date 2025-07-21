import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  console.log('Auth callback started:', request.url)
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'

  console.log('Code received:', !!code)
  console.log('Redirect to:', redirectTo)

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `remove` method was called from a Server Component.
            }
          },
        },
      }
    )
    
    try {
      console.log('Attempting to exchange code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Exchange result:', { hasData: !!data, hasError: !!error })
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
      }

      if (data.user) {
        console.log('Auth success for user:', data.user.id)
        console.log('Redirecting to demo page...')
        
        // Temporary: Skip profile check and redirect to demo page
        return NextResponse.redirect(new URL('/demo', request.url))
      } else {
        console.log('No user data received')
        return NextResponse.redirect(new URL('/login?error=no_user', request.url))
      }
    } catch (error) {
      console.error('Unexpected auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=unexpected_error', request.url))
    }
  }

  // If no code or other issues, redirect to login
  console.log('No code provided, redirecting to login')
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}