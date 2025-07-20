import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'

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
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
      }

      if (data.user) {
        // Get user profile to determine correct dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        let dashboardPath = '/dashboard'
        if (profile) {
          switch (profile.role) {
            case 'student':
              dashboardPath = '/dashboard/student/dashboard'
              break
            case 'teacher':
              dashboardPath = '/dashboard/teacher/dashboard'
              break
            case 'admin':
              dashboardPath = '/dashboard/admin/dashboard'
              break
          }
        }

        const finalRedirect = redirectTo === '/dashboard' ? dashboardPath : redirectTo
        return NextResponse.redirect(new URL(finalRedirect, request.url))
      }
    } catch (error) {
      console.error('Unexpected auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=unexpected_error', request.url))
    }
  }

  // If no code or other issues, redirect to login
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}