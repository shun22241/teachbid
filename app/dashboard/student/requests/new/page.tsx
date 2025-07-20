'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RequestForm } from '@/components/requests/RequestForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { generateSlug } from '@/lib/utils/slug-generator'
import type { RequestFormData } from '@/lib/utils/validation-schemas'

export default function NewRequestPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data: RequestFormData) {
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: 'エラー',
          description: 'ログインが必要です',
          variant: 'destructive'
        })
        return
      }

      // Generate slug
      const slug = generateSlug(data.title)

      // Calculate expires_at (7 days from now)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const requestData = {
        student_id: user.id,
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        format: data.format,
        location: data.location || null,
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        duration_hours: data.durationHours,
        preferred_schedule: data.preferredSchedule || null,
        experience_level: data.experienceLevel,
        specific_requirements: data.specificRequirements || null,
        materials_needed: data.materialsNeeded || null,
        status: 'open' as const,
        expires_at: expiresAt.toISOString()
      }

      const { data: request, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select()
        .single()

      if (error) throw error

      toast({
        title: '成功',
        description: 'リクエストが作成されました'
      })

      router.push(`/dashboard/student/requests/${request.id}`)
    } catch (error) {
      console.error('Error creating request:', error)
      toast({
        title: 'エラー',
        description: 'リクエストの作成に失敗しました',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">新規リクエスト</h1>
          <p className="text-muted-foreground">
            学習したい内容を詳しく教えてください
          </p>
        </div>
      </div>

      {/* Form */}
      <RequestForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}