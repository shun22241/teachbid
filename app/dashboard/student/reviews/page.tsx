'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useReviews } from '@/hooks/useReviews'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MessageSquare, Edit, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface ReviewableTransaction {
  id: string
  request: {
    title: string
  }
  teacher: {
    full_name: string
    avatar_url: string | null
  }
}

export default function StudentReviewsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { 
    fetchUserReviews, 
    getReviewableTransactions,
    loading 
  } = useReviews()
  
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [givenReviews, setGivenReviews] = useState<any[]>([])
  const [receivedReviews, setReceivedReviews] = useState<any[]>([])
  const [reviewableTransactions, setReviewableTransactions] = useState<ReviewableTransaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<ReviewableTransaction | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'student') {
          router.push('/dashboard')
          return
        }

        setCurrentUser({ ...user, ...profile })

        // Load data
        const [given, received, reviewable] = await Promise.all([
          fetchUserReviews(user.id, 'given'),
          fetchUserReviews(user.id, 'received'),
          getReviewableTransactions('student')
        ])

        setGivenReviews(given)
        setReceivedReviews(received)
        setReviewableTransactions(reviewable)

      } catch (error) {
        console.error('Error initializing:', error)
        router.push('/login')
      } finally {
        setInitialLoading(false)
      }
    }

    initialize()
  }, [supabase, router, fetchUserReviews, getReviewableTransactions])

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    setSelectedTransaction(null)
    // Refresh data
    fetchUserReviews(currentUser.id, 'given').then(setGivenReviews)
    getReviewableTransactions('student').then(setReviewableTransactions)
  }

  if (initialLoading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="レビュー管理"
        description="講師への評価と受け取った評価を管理します"
      />

      <Tabs defaultValue="to-review" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="to-review" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            評価待ち ({reviewableTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="given" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            投稿済み ({givenReviews.length})
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            受け取った評価 ({receivedReviews.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Reviews */}
        <TabsContent value="to-review">
          <Card>
            <CardHeader>
              <CardTitle>評価待ちの講師</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewableTransactions.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle className="h-12 w-12" />}
                  title="すべての評価が完了しています"
                  description="完了したレッスンの評価はすべて済んでいます"
                />
              ) : (
                <div className="space-y-4">
                  {reviewableTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{transaction.teacher.full_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.request.title}
                        </p>
                        <Badge variant="secondary" className="mt-1">評価待ち</Badge>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            評価を書く
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>講師への評価</DialogTitle>
                          </DialogHeader>
                          {selectedTransaction && (
                            <ReviewForm
                              transactionId={selectedTransaction.id}
                              requestId="request-id" // This would come from the transaction
                              revieweeId="teacher-id" // This would come from the transaction
                              reviewerType="student"
                              revieweeName={selectedTransaction.teacher.full_name}
                              requestTitle={selectedTransaction.request.title}
                              onSuccess={handleReviewSuccess}
                              onCancel={() => setSelectedTransaction(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Given Reviews */}
        <TabsContent value="given">
          <Card>
            <CardHeader>
              <CardTitle>投稿したレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSpinner />
              ) : givenReviews.length === 0 ? (
                <EmptyState
                  icon={<MessageSquare className="h-12 w-12" />}
                  title="まだレビューを投稿していません"
                  description="完了したレッスンの評価を投稿してください"
                />
              ) : (
                <div className="space-y-4">
                  {givenReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showReviewee={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Received Reviews */}
        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle>受け取った評価</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSpinner />
              ) : receivedReviews.length === 0 ? (
                <EmptyState
                  icon={<Star className="h-12 w-12" />}
                  title="まだ評価を受け取っていません"
                  description="講師からの評価をお待ちください"
                />
              ) : (
                <div className="space-y-4">
                  {receivedReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showReviewee={false}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}