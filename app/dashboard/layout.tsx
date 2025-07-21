import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ダッシュボード | TeachBid',
  description: 'TeachBid ダッシュボード'
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">TeachBid</h1>
            <nav className="flex space-x-4">
              <a href="/auth/login" className="text-gray-500 hover:text-gray-700">
                ログアウト
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}