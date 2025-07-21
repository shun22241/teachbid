"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="flex justify-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">
            ページが見つかりません
          </h2>
          <p className="text-muted-foreground">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              ホームに戻る
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <span className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              前のページに戻る
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}