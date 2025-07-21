import { lazy } from 'react'

// Lazy load heavy components
export const LazyRequestForm = lazy(() => 
  import('@/components/requests/RequestForm').then(module => ({ default: module.RequestForm }))
)

export const LazyProposalForm = lazy(() => 
  import('@/components/proposals/ProposalForm').then(module => ({ default: module.ProposalForm }))
)

// export const LazyPaymentForm = lazy(() => 
//   import('@/components/payment/PaymentForm').then(module => ({ default: module.PaymentForm }))
// )

export const LazyMessageList = lazy(() => 
  import('@/components/messages/MessageList').then(module => ({ default: module.MessageList }))
)

export const LazyConversationList = lazy(() => 
  import('@/components/messages/ConversationList').then(module => ({ default: module.ConversationList }))
)

export const LazyReviewForm = lazy(() => 
  import('@/components/reviews/ReviewForm').then(module => ({ default: module.ReviewForm }))
)