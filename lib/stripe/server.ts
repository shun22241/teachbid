import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export interface CreatePaymentIntentParams {
  amount: number
  currency?: string
  studentId: string
  teacherId: string
  proposalId: string
  requestId: string
  metadata?: Record<string, string>
}

export async function createPaymentIntent({
  amount,
  currency = 'jpy',
  studentId,
  teacherId,
  proposalId,
  requestId,
  metadata = {}
}: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe expects amount in cents for most currencies, but yen is 0-decimal
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        student_id: studentId,
        teacher_id: teacherId,
        proposal_id: proposalId,
        request_id: requestId,
        ...metadata,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export interface CreateConnectedAccountParams {
  email: string
  country?: string
  type?: 'express' | 'standard'
}

export async function createConnectedAccount(params: any) {
  try {
    const account = await stripe.accounts.create({
      type: params.type || 'express',
      country: params.country || 'JP',
      email: params.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: params.business_type,
      individual: params.individual,
    })

    return account
  } catch (error) {
    console.error('Error creating connected account:', error)
    throw error
  }
}

export async function createAccountLink(params: any) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: params.account,
      refresh_url: params.refresh_url,
      return_url: params.return_url,
      type: params.type || 'account_onboarding',
    })

    return accountLink
  } catch (error) {
    console.error('Error creating account link:', error)
    throw error
  }
}

export async function createTransfer(amount: number, destinationAccount: string, metadata?: Record<string, string>) {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount),
      currency: 'jpy',
      destination: destinationAccount,
      metadata,
    })

    return transfer
  } catch (error) {
    console.error('Error creating transfer:', error)
    throw error
  }
}

export async function retrieveAccount(accountId: string) {
  try {
    const account = await stripe.accounts.retrieve(accountId)
    return account
  } catch (error) {
    console.error('Error retrieving account:', error)
    throw error
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw error
  }
}

export async function createLoginLink(accountId: string) {
  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId)
    return loginLink
  } catch (error) {
    console.error('Error creating login link:', error)
    throw error
  }
}