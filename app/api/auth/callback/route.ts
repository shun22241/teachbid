import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=callback_error`)
      }

      if (data.user) {
        // Get user profile to determine redirect destination
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const dashboardPath = profile?.role === 'student' 
          ? '/dashboard/student/dashboard'
          : profile?.role === 'teacher'
          ? '/dashboard/teacher/dashboard'
          : '/dashboard/admin/dashboard'

        return NextResponse.redirect(`${requestUrl.origin}${dashboardPath}`)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=callback_error`)
    }
  }

  // Return the user to the login page if something went wrong
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}