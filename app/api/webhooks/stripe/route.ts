import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    const supabase = createClient()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        
        // Update proposal status to accepted
        const { error } = await supabase
          .from('proposals')
          .update({ 
            status: 'accepted',
            accepted_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)

        if (error) {
          console.error('Error updating proposal:', error)
        }

        // Update request status to in_progress
        if (paymentIntent.metadata?.request_id) {
          await supabase
            .from('requests')
            .update({ status: 'in_progress' })
            .eq('id', paymentIntent.metadata.request_id)
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        
        // Update proposal status back to pending
        const { error } = await supabase
          .from('proposals')
          .update({ 
            status: 'pending',
            payment_intent_id: null
          })
          .eq('payment_intent_id', paymentIntent.id)

        if (error) {
          console.error('Error updating proposal:', error)
        }

        break
      }

      case 'account.updated': {
        const account = event.data.object
        
        // Update teacher's Stripe account status
        const { error } = await supabase
          .from('profiles')
          .update({ 
            stripe_account_id: account.id,
            stripe_account_enabled: account.charges_enabled && account.payouts_enabled
          })
          .eq('stripe_account_id', account.id)

        if (error) {
          console.error('Error updating teacher account:', error)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}