import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentIntent } from '@/lib/stripe/server'
import { calculateStudentFee, calculateTeacherFee } from '@/lib/utils/fee-calculator'

export async function POST(request: NextRequest) {
  try {
    const { proposalId } = await request.json()

    if (!proposalId) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 })
    }

    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get proposal details with request and teacher info
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        request:requests!inner(*),
        teacher:profiles!teacher_id(*)
      `)
      .eq('id', proposalId)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    // Verify user is the student who created the request
    if (proposal.request.student_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Verify proposal is pending
    if (proposal.status !== 'pending') {
      return NextResponse.json({ error: 'Proposal is not available for payment' }, { status: 400 })
    }

    // Calculate fees
    const proposedFee = Number(proposal.proposed_fee)
    const studentFee = calculateStudentFee(proposedFee)
    const teacherFee = calculateTeacherFee(proposedFee)

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount: studentFee,
      studentId: user.id,
      teacherId: proposal.teacher_id,
      proposalId: proposal.id,
      requestId: proposal.request_id,
      metadata: {
        proposal_fee: proposedFee.toString(),
        teacher_fee: teacherFee.toString(),
        platform_fee: (studentFee - proposedFee).toString(),
      }
    })

    // Update proposal status to processing
    await supabase
      .from('proposals')
      .update({ 
        status: 'processing',
        payment_intent_id: paymentIntent.id
      })
      .eq('id', proposalId)

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: studentFee,
      proposal_fee: proposedFee,
      teacher_fee: teacherFee,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}