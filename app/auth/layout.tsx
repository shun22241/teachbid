import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                ホームに戻る
              </Button>
            </Link>
            <Link href="/" className="text-2xl font-bold text-blue-600">
              TeachBid
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 TeachBid. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-2">
              <Link href="/terms" className="hover:text-gray-800 transition-colors">
                利用規約
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/privacy" className="hover:text-gray-800 transition-colors">
                プライバシーポリシー
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/contact" className="hover:text-gray-800 transition-colors">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}