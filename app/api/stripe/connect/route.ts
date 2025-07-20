import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createConnectedAccount, createAccountLink } from '@/lib/stripe/server'

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

    // Check if user is a teacher
    if (profile.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create Stripe accounts' }, { status: 403 })
    }

    // Check if already has a Stripe account
    if (profile.stripe_account_id) {
      return NextResponse.json({ error: 'Stripe account already exists' }, { status: 400 })
    }

    // Create Stripe Connect account
    const account = await createConnectedAccount({
      email: user.email!,
      country: 'JP',
      type: 'express',
      business_type: 'individual',
      individual: {
        email: user.email!,
        first_name: profile.full_name.split(' ')[0] || '',
        last_name: profile.full_name.split(' ').slice(1).join(' ') || '',
      }
    })

    // Update profile with Stripe account ID
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_account_id: account.id })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Create account link for onboarding
    const accountLink = await createAccountLink({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teacher/stripe/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teacher/stripe/complete`,
      type: 'account_onboarding'
    })

    return NextResponse.json({
      account_id: account.id,
      onboarding_url: accountLink.url
    })

  } catch (error) {
    console.error('Error creating Stripe account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}