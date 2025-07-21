'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useReviews } from '@/hooks/useReviews'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { ReviewStats } from '@/components/reviews/ReviewStats'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  MessageSquare,
  GraduationCap,
  Award,
  Calendar,
  User
} from 'lucide-react'
import Link from 'next/link'

interface TeacherProfile {
  id: string
  full_name: string
  bio: string | null
  avatar_url: string | null
  subjects: string[]
  hourly_rate_min: number | null
  hourly_rate_max: number | null
  location: string | null
  experience_years: number | null
  education: string | null
  certifications: string[] | null
  languages: string[] | null
  average_rating: number
  total_reviews: number
  created_at: string
}

export default function TeacherProfilePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { fetchUserReviews, fetchUserReviewStats } = useReviews()
  
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function fetchTeacherProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)

        const { data: teacherData, error: teacherError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', params.id)
          .eq('role', 'teacher')
          .single()

        if (teacherError) throw teacherError

        setTeacher(teacherData)

        // Fetch reviews and stats
        const [reviewsData, statsData] = await Promise.all([
          fetchUserReviews(params.id as string, 'received'),
          fetchUserReviewStats(params.id as string)
        ])

        setReviews(reviewsData)
        setReviewStats(statsData)

      } catch (error) {
        console.error('Error fetching teacher profile:', error)
        router.push('/teachers')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTeacherProfile()
    }
  }, [params.id, supabase, router, fetchUserReviews, fetchUserReviewStats])

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />
  }

  if (!teacher) {
    return (
      <EmptyState
        icon={<User className="h-12 w-12" />}
        title="講師が見つかりません"
        description="指定された講師は存在しないか、アクセスできません"
        action={
          <Button onClick={() => router.push('/teachers')}>
            講師一覧に戻る
          </Button>
        }
      />
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title={teacher.full_name}
        showBackButton
        backHref="/teachers"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={teacher.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {teacher.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold">{teacher.full_name}</h1>
                    
                    {teacher.average_rating > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(teacher.average_rating)}
                        </div>
                        <span className="text-lg font-medium">
                          {teacher.average_rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">
                          ({teacher.total_reviews}件のレビュー)
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {teacher.subjects && teacher.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    {currentUser && currentUser.id !== teacher.id && (
                      <>
                        <Button asChild>
                          <Link href={`/dashboard/student/messages?teacher=${teacher.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            メッセージを送る
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/dashboard/student/requests/new">
                            リクエストを作成
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Info */}
          <Card>
            <CardHeader>
              <CardTitle>詳細情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {teacher.bio && (
                <div>
                  <h4 className="font-medium mb-2">自己紹介</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {teacher.bio}
                  </p>
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-2">
                {teacher.hourly_rate_min && teacher.hourly_rate_max && (
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">時給</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(teacher.hourly_rate_min)} - {formatCurrency(teacher.hourly_rate_max)}
                      </p>
                    </div>
                  </div>
                )}
                
                {teacher.experience_years && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">指導経験</p>
                      <p className="text-sm text-muted-foreground">
                        {teacher.experience_years}年
                      </p>
                    </div>
                  </div>
                )}
                
                {teacher.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">拠点</p>
                      <p className="text-sm text-muted-foreground">
                        {teacher.location}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">登録日</p>
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeTime(teacher.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              
              {teacher.education && (
                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">学歴</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.education}
                    </p>
                  </div>
                </div>
              )}
              
              {teacher.certifications && teacher.certifications.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">資格・認定</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {teacher.languages && teacher.languages.length > 0 && (
                <div>
                  <p className="font-medium mb-2">対応言語</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reviews">
                レビュー ({reviews.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="space-y-4">
              {reviews.length === 0 ? (
                <EmptyState
                  icon={<Star className="h-12 w-12" />}
                  title="まだレビューがありません"
                  description="この講師へのレビューをお待ちしています"
                />
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showReviewee={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review Stats */}
          {reviewStats && (
            <ReviewStats
              totalReviews={reviewStats.total_reviews}
              averageRating={reviewStats.average_rating}
              ratingDistribution={reviewStats.rating_distribution}
            />
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>アクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentUser && currentUser.id !== teacher.id ? (
                <>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/student/messages?teacher=${teacher.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      メッセージを送る
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/student/requests/new">
                      リクエストを作成
                    </Link>
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {currentUser?.id === teacher.id 
                    ? 'これはあなたのプロフィールです'
                    : 'ログインしてアクションを実行'
                  }
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}