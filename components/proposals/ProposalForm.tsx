'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { proposalSchema, type ProposalFormData } from '@/lib/utils/validation-schemas'
import { formatCurrency, calculateTeacherFee } from '@/lib/utils/fee-calculator'
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
  DollarSign,
  MessageSquare,
  FileText,
  Clock,
  Calculator,
  Info
} from 'lucide-react'

interface ProposalFormProps {
  onSubmit: (data: ProposalFormData) => void
  loading?: boolean
  budgetMin: number
  budgetMax: number
  durationHours: number
  defaultValues?: Partial<ProposalFormData>
}

export function ProposalForm({
  onSubmit,
  loading = false,
  budgetMin,
  budgetMax,
  durationHours,
  defaultValues
}: ProposalFormProps) {
  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      proposedFee: budgetMin,
      message: '',
      lessonPlan: '',
      estimatedDuration: durationHours,
      availability: '',
      ...defaultValues
    }
  })

  const watchProposedFee = form.watch('proposedFee')
  const teacherFee = calculateTeacherFee(watchProposedFee || 0)

  function handleSubmit(data: ProposalFormData) {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Fee Proposal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              提案料金
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">生徒の予算範囲</span>
                <Badge variant="outline">
                  {formatCurrency(budgetMin)} - {formatCurrency(budgetMax)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                この範囲内で提案料金を設定してください
              </p>
            </div>

            <FormField
              control={form.control}
              name="proposedFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>提案料金 *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={budgetMin}
                      max={budgetMax}
                      step="100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    生徒が設定した予算範囲内で設定してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchProposedFee && (
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>生徒支払額:</span>
                      <span className="font-medium">{formatCurrency(watchProposedFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>プラットフォーム手数料:</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(watchProposedFee - teacherFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                      <span>あなたの受取額:</span>
                      <span className="text-green-600">{formatCurrency(teacherFee)}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="estimatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>実際の指導時間 *</FormLabel>
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
                    生徒の希望: {durationHours}時間
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              提案メッセージ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>自己紹介・提案内容 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="・自己紹介（経歴、専門分野など）&#10;・なぜあなたが最適な講師なのか&#10;・指導方針や教え方について&#10;・生徒への質問があれば..."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    あなたの経験や指導スタイルを具体的に説明してください（50文字以上1000文字以内）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Lesson Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              レッスンプラン
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="lessonPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>具体的なカリキュラム *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="・第1回: 基礎概念の説明と環境構築&#10;・第2回: 実践的な演習問題&#10;・第3回: プロジェクト作成と質疑応答&#10;&#10;など、具体的な進め方を説明してください"
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    どのような内容で、どのような順序で指導するかを詳しく説明してください（2000文字以内）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              スケジュール
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>対応可能な日時</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例:&#10;・平日: 19:00〜22:00&#10;・土日: 10:00〜18:00&#10;・その他: 調整可能"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    対応可能な曜日・時間帯を具体的に教えてください（任意）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tips */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>良い提案のコツ:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• 具体的な経験や実績を示す</li>
              <li>• 生徒のレベルに合わせた指導方法を説明</li>
              <li>• 明確なゴールと達成までの道筋を提示</li>
              <li>• 質問に対して事前に答えを用意する</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? '提案送信中...' : '提案を送信'}
          </Button>
        </div>
      </form>
    </Form>
  )
}