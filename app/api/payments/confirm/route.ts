import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { retrievePaymentIntent } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    const { payment_intent_id } = await request.json()

    if (!payment_intent_id) {
      return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 })
    }

    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await retrievePaymentIntent(payment_intent_id)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
    }

    // Get proposal by payment intent ID
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        request:requests!inner(*)
      `)
      .eq('payment_intent_id', payment_intent_id)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    // Verify user is the student
    if (proposal.request.student_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Begin transaction to update multiple tables
    const { error: transactionError } = await supabase.rpc('process_successful_payment', {
      p_proposal_id: proposal.id,
      p_request_id: proposal.request_id,
      p_payment_intent_id: payment_intent_id,
      p_amount: Number(paymentIntent.metadata?.proposal_fee || 0),
      p_student_fee: paymentIntent.amount_received,
      p_teacher_fee: Number(paymentIntent.metadata?.teacher_fee || 0),
      p_platform_fee: Number(paymentIntent.metadata?.platform_fee || 0)
    })

    if (transactionError) {
      console.error('Transaction error:', transactionError)
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
    }

    // Create notifications
    await Promise.all([
      // Notify teacher
      supabase.from('notifications').insert({
        user_id: proposal.teacher_id,
        type: 'proposal_accepted',
        title: '提案が承認されました',
        body: `「${proposal.request.title}」の提案が承認され、レッスンが開始されます。`,
        metadata: {
          proposal_id: proposal.id,
          request_id: proposal.request_id
        }
      }),
      
      // Notify student
      supabase.from('notifications').insert({
        user_id: proposal.request.student_id,
        type: 'payment_confirmed',
        title: '決済が完了しました',
        body: `「${proposal.request.title}」の決済が完了し、レッスンが開始されます。`,
        metadata: {
          proposal_id: proposal.id,
          request_id: proposal.request_id
        }
      })
    ])

    return NextResponse.json({
      success: true,
      proposal_id: proposal.id,
      request_id: proposal.request_id
    })

  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}