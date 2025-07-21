import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'ログイン | TeachBid',
  description: 'TeachBidにログインして、学習または指導を始めましょう。',
}

export default function LoginPage() {
  return <LoginForm />
}