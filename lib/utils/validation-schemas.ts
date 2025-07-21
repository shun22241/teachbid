import { z } from 'zod'
import { CATEGORIES } from '@/lib/constants/categories'
import { FEE_RATES } from '@/lib/constants/fee-rates'

// Common validation rules
const emailSchema = z.string().email('有効なメールアドレスを入力してください')
const passwordSchema = z.string().min(8, 'パスワードは8文字以上である必要があります')
const urlSchema = z.string().url('有効なURLを入力してください').optional().or(z.literal(''))
const phoneSchema = z.string().regex(/^[\d\-\+\(\)\s]+$/, '有効な電話番号を入力してください').optional()

// User registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  displayName: z.string().min(2, '表示名は2文字以上で入力してください').max(20, '表示名は20文字以内で入力してください'),
  role: z.enum(['student', 'teacher'], {
    required_error: '役割を選択してください',
  }),
  terms: z.boolean().refine(val => val === true, {
    message: '利用規約に同意する必要があります',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

// User login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'パスワードを入力してください'),
})

// Profile update schema
export const profileUpdateSchema = z.object({
  displayName: z.string().min(2, '表示名は2文字以上で入力してください').max(20, '表示名は20文字以内で入力してください'),
  bio: z.string().max(500, '自己紹介は500文字以内で入力してください').optional(),
  skills: z.array(z.string()).max(10, 'スキルは10個まで登録可能です').optional(),
  certifications: z.array(z.string()).max(10, '資格は10個まで登録可能です').optional(),
  hourlyRateMin: z.number().min(1000, '最低時給は1,000円以上で設定してください').max(50000, '最低時給は50,000円以下で設定してください').optional(),
  hourlyRateMax: z.number().min(1000, '最高時給は1,000円以上で設定してください').max(50000, '最高時給は50,000円以下で設定してください').optional(),
  avatarUrl: urlSchema,
  website: urlSchema,
  phone: phoneSchema,
}).refine(data => {
  if (data.hourlyRateMin && data.hourlyRateMax) {
    return data.hourlyRateMin <= data.hourlyRateMax
  }
  return true
}, {
  message: '最高時給は最低時給以上で設定してください',
  path: ['hourlyRateMax'],
})

// Request creation schema
export const requestCreateSchema = z.object({
  title: z.string()
    .min(10, 'タイトルは10文字以上で入力してください')
    .max(100, 'タイトルは100文字以内で入力してください'),
  category: z.enum(CATEGORIES.map(cat => cat.slug) as [string, ...string[]], {
    required_error: 'カテゴリーを選択してください',
  }),
  subcategory: z.string().optional(),
  description: z.string()
    .min(50, '詳細説明は50文字以上で入力してください')
    .max(2000, '詳細説明は2000文字以内で入力してください'),
  learningGoals: z.array(z.string().min(1, '学習目標を入力してください'))
    .min(1, '学習目標を少なくとも1つ入力してください')
    .max(5, '学習目標は5つまでです'),
  currentLevel: z.string().optional(),
  budgetMin: z.number()
    .min(FEE_RATES.MIN_REQUEST_AMOUNT, `最低予算は${FEE_RATES.MIN_REQUEST_AMOUNT.toLocaleString()}円以上で設定してください`)
    .max(FEE_RATES.MAX_REQUEST_AMOUNT, `最低予算は${FEE_RATES.MAX_REQUEST_AMOUNT.toLocaleString()}円以下で設定してください`),
  budgetMax: z.number()
    .min(FEE_RATES.MIN_REQUEST_AMOUNT, `最高予算は${FEE_RATES.MIN_REQUEST_AMOUNT.toLocaleString()}円以上で設定してください`)
    .max(FEE_RATES.MAX_REQUEST_AMOUNT, `最高予算は${FEE_RATES.MAX_REQUEST_AMOUNT.toLocaleString()}円以下で設定してください`),
  durationWeeks: z.number().min(1, '期間は1週間以上である必要があります').max(52, '期間は52週間以下である必要があります').optional(),
  lessonsPerWeek: z.number().min(1, '週のレッスン数は1以上である必要があります').max(7, '週のレッスン数は7以下である必要があります').optional(),
  lessonDurationMinutes: z.enum(['30', '45', '60', '90', '120']).transform(val => parseInt(val)).optional(),
  preferredSchedule: z.object({
    days: z.array(z.string()),
    times: z.array(z.string()),
  }).optional(),
  deadline: z.string().optional(),
  isUrgent: z.boolean().default(false),
}).refine(data => data.budgetMin <= data.budgetMax, {
  message: '最高予算は最低予算以上で設定してください',
  path: ['budgetMax'],
})

// Proposal creation schema
export const proposalCreateSchema = z.object({
  requestId: z.string().uuid('無効なリクエストIDです'),
  amount: z.number()
    .min(FEE_RATES.MIN_REQUEST_AMOUNT, `提案金額は${FEE_RATES.MIN_REQUEST_AMOUNT.toLocaleString()}円以上である必要があります`)
    .max(FEE_RATES.MAX_REQUEST_AMOUNT, `提案金額は${FEE_RATES.MAX_REQUEST_AMOUNT.toLocaleString()}円以下である必要があります`),
  message: z.string()
    .min(50, 'メッセージは50文字以上で入力してください')
    .max(1000, 'メッセージは1000文字以内で入力してください'),
  lessonPlan: z.string()
    .min(1, 'レッスンプランは必須です')
    .max(2000, 'レッスンプランは2000文字以内で入力してください'),
  availableSchedule: z.object({
    days: z.array(z.string()),
    times: z.array(z.string()),
  }).optional(),
  sampleMaterials: z.array(z.string().url('有効なURLを入力してください')).max(5, 'サンプル教材は5つまで登録可能です').optional(),
  guaranteeTerms: z.string().max(500, '保証条件は500文字以内で入力してください').optional(),
})

// Review creation schema
export const reviewCreateSchema = z.object({
  transactionId: z.string().uuid('無効な取引IDです'),
  rating: z.number()
    .min(1, '評価は1以上である必要があります')
    .max(5, '評価は5以下である必要があります'),
  comment: z.string()
    .max(500, 'コメントは500文字以内で入力してください')
    .optional(),
  isPublic: z.boolean().default(true),
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(50, '名前は50文字以内で入力してください'),
  email: emailSchema,
  subject: z.string().min(1, '件名は必須です').max(100, '件名は100文字以内で入力してください'),
  message: z.string()
    .min(10, 'メッセージは10文字以上で入力してください')
    .max(2000, 'メッセージは2000文字以内で入力してください'),
  category: z.enum(['general', 'technical', 'billing', 'feature', 'other'], {
    required_error: 'カテゴリーを選択してください',
  }),
})

// Password reset schema
export const passwordResetSchema = z.object({
  email: emailSchema,
})

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, '検索キーワードを入力してください').max(100, '検索キーワードは100文字以内で入力してください'),
  category: z.string().optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  sortBy: z.enum(['relevance', 'created_at', 'budget_max', 'deadline']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Filter schemas
export const requestFiltersSchema = z.object({
  category: z.string().optional(),
  status: z.enum(['open', 'matched', 'in_progress', 'completed', 'cancelled']).optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  urgentOnly: z.boolean().default(false),
  sortBy: z.enum(['created_at', 'budget_max', 'deadline', 'views']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const proposalFiltersSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'withdrawn']).optional(),
  amountMin: z.number().min(0).optional(),
  amountMax: z.number().min(0).optional(),
  sortBy: z.enum(['amount', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// File upload schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'ファイルを選択してください' }),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
}).refine(data => data.file.size <= data.maxSize, {
  message: 'ファイルサイズが大きすぎます',
}).refine(data => data.allowedTypes.includes(data.file.type), {
  message: 'サポートされていないファイル形式です',
})

// Admin schemas
export const adminUserUpdateSchema = z.object({
  displayName: z.string().min(1, '表示名は必須です').optional(),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const adminNotificationSchema = z.object({
  userId: z.string().uuid('無効なユーザーIDです').optional(),
  userRole: z.enum(['student', 'teacher', 'admin']).optional(),
  type: z.string().min(1, '通知タイプは必須です'),
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  message: z.string().min(1, 'メッセージは必須です').max(500, 'メッセージは500文字以内で入力してください'),
  link: urlSchema,
  scheduleAt: z.string().optional(),
}).refine(data => {
  // Either userId or userRole must be specified
  return data.userId || data.userRole
}, {
  message: 'ユーザーIDまたはユーザー役割のいずれかを指定してください',
  path: ['userId'],
})

// Backwards compatibility exports
export const proposalFormSchema = proposalCreateSchema
export const requestFormSchema = requestCreateSchema
export const proposalSchema = proposalCreateSchema
export const requestSchema = requestCreateSchema

// Type exports for use in components
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type RequestCreateData = z.infer<typeof requestCreateSchema>
export type ProposalCreateData = z.infer<typeof proposalCreateSchema>
export type ReviewCreateData = z.infer<typeof reviewCreateSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>
export type SearchData = z.infer<typeof searchSchema>
export type RequestFiltersData = z.infer<typeof requestFiltersSchema>
export type ProposalFiltersData = z.infer<typeof proposalFiltersSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>
export type AdminUserUpdateData = z.infer<typeof adminUserUpdateSchema>
export type AdminNotificationData = z.infer<typeof adminNotificationSchema>