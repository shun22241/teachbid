import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLoginLink } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if user is a teacher with Stripe account
    if (profile.role !== 'teacher' || !profile.stripe_account_id) {
      return NextResponse.json({ error: 'Stripe account not found' }, { status: 404 })
    }

    // Create login link to Stripe Express dashboard
    const loginLink = await createLoginLink(profile.stripe_account_id)

    return NextResponse.json({
      dashboard_url: loginLink.url
    })

  } catch (error) {
    console.error('Error creating dashboard link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}