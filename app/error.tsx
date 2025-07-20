'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="flex justify-center">
          <AlertTriangle className="h-24 w-24 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            エラーが発生しました
          </h1>
          <p className="text-muted-foreground">
            申し訳ございません。予期しないエラーが発生しました。
            ページを再読み込みするか、しばらく時間をおいてから再度お試しください。
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              エラーID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            再試行
          </Button>
          <Button asChild variant="outline">
            <a href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              ホームに戻る
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}