import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: '新規登録 | TeachBid',
  description: 'TeachBidに登録して、学習または指導を始めましょう。生徒として学ぶか、講師として教えるかを選択できます。',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}