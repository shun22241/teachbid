import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff, RefreshCw, Home, MessageCircle } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-gray-400" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            オフラインです
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            インターネット接続を確認してください。一部の機能はオフラインでも利用できます。
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              再試行
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              ホームに戻る
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              オフラインで利用可能な機能
            </h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• 閲覧済みページの表示</li>
              <li>• 保存済みメッセージの確認</li>
              <li>• プロフィール情報の編集（同期は後で実行）</li>
              <li>• キャッシュされたコンテンツの閲覧</li>
            </ul>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              <MessageCircle className="h-3 w-3 inline mr-1" />
              オフライン中の操作は接続復旧時に自動的に同期されます。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}