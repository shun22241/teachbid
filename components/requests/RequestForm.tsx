'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { requestSchema, type RequestCreateData } from '@/lib/utils/validation-schemas'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  MapPin,
  Monitor,
  Clock,
  DollarSign,
  BookOpen,
  GraduationCap,
  FileText,
  Package
} from 'lucide-react'

interface RequestFormProps {
  onSubmit: (data: RequestCreateData) => void
  loading?: boolean
  defaultValues?: Partial<RequestCreateData>
}

const categories = [
  'プログラミング',
  '語学',
  '数学',
  '物理',
  '化学',
  '生物',
  '英語',
  '国語',
  '社会',
  '音楽',
  '美術',
  'ビジネス',
  'その他'
]

const experienceLevels = [
  { value: 'beginner', label: '初心者', description: '基礎から学びたい' },
  { value: 'intermediate', label: '中級者', description: 'ある程度の知識はある' },
  { value: 'advanced', label: '上級者', description: 'より深い知識を求めている' }
]

export function RequestForm({ onSubmit, loading = false, defaultValues }: RequestFormProps) {
  const form = useForm<RequestCreateData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      learningGoals: [''],
      budgetMin: 2000,
      budgetMax: 5000,
      isUrgent: false,
      ...defaultValues
    }
  })

  const watchBudgetMin = form.watch('budgetMin')
  const watchBudgetMax = form.watch('budgetMax')

  function handleSubmit(data: RequestCreateData) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              基本情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例: React Hooksの使い方を教えてください"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    学習したい内容を簡潔に表現してください（50文字以内）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>詳細説明 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="学習したい内容、現在のレベル、達成したい目標などを詳しく説明してください..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    講師が理解しやすいよう、具体的に説明してください（1000文字以内）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>経験レベル *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4"
                    >
                      {experienceLevels.map((level) => (
                        <div key={level.value} className="flex items-center space-x-3">
                          <RadioGroupItem value={level.value} id={level.value} />
                          <div className="flex-1">
                            <Label htmlFor={level.value} className="font-medium cursor-pointer">
                              {level.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {level.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Format and Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              受講形式
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
{/*
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>形式 *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                          <Monitor className="h-4 w-4" />
                          オンライン
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in_person" id="in_person" />
                        <Label htmlFor="in_person" className="flex items-center gap-2 cursor-pointer">
                          <MapPin className="h-4 w-4" />
                          対面
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both" className="cursor-pointer">
                          どちらでも
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}

{/*
            {false && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>希望場所</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例: 東京都渋谷区、新宿駅周辺"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      対面の場合の希望場所を入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            */}
          </CardContent>
        </Card>

        {/* Budget and Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              予算と時間
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最低予算 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="500"
                        max="100000"
                        step="500"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {formatCurrency(watchBudgetMin || 0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最高予算 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="500"
                        max="100000"
                        step="500"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {formatCurrency(watchBudgetMax || 0)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lessonDurationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>希望時間 *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="時間を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 1.5, 2, 2.5, 3, 4, 5, 6].map((hours) => (
                        <SelectItem key={hours} value={hours.toString()}>
                          {hours}時間
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    1回の指導時間を選択してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

{/*
            <FormField
              control={form.control}
              name="preferredSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>希望スケジュール</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 平日夜19:00以降、土日午前中など"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    可能な曜日・時間帯を教えてください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}
          </CardContent>
        </Card>

        {/* Additional Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              追加要件
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
{/*
            <FormField
              control={form.control}
              name="specificRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>特別な要望</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="講師への特別な要望や条件があれば記入してください..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    講師の経験、資格、教え方の希望など（任意）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materialsNeeded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>必要な教材・機材</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="必要な教材、ソフトウェア、機材があれば記入してください..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    学習に必要なもの（任意）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? 'リクエスト作成中...' : 'リクエストを作成'}
          </Button>
        </div>
      </form>
    </Form>
  )
}