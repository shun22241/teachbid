'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthTestPage() {
  const [status, setStatus] = useState<string>('未テスト')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [oauthUrl, setOauthUrl] = useState<string>('')
  
  const supabase = createClient()

  const testGoogleAuth = async () => {
    setLoading(true)
    setError('')
    setStatus('テスト中...')
    
    try {
      console.log('Starting Google OAuth test...')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/auth/test`,
          skipBrowserRedirect: false, // 明示的に設定
        },
      })
      
      console.log('OAuth response:', data)
      
      if (error) {
        console.error('OAuth error:', error)
        throw error
      }
      
      setStatus('リダイレクト中...')
      
      if (data?.url) {
        console.log('Redirecting to:', data.url)
        setOauthUrl(data.url) // URLを保存
        
        // 方法1: 新しいタブで開く（最も確実）
        const newWindow = window.open(data.url, '_self')
        
        // 方法2: フォームを作成してsubmit
        if (!newWindow) {
          console.log('Window.open failed, trying form submit...')
          const form = document.createElement('form')
          form.method = 'GET'
          form.action = data.url
          document.body.appendChild(form)
          form.submit()
        }
        
        // 方法3: metaタグでリダイレクト
        setTimeout(() => {
          if (window.location.href.includes('/auth/test')) {
            console.log('Previous methods failed, trying meta refresh...')
            const meta = document.createElement('meta')
            meta.httpEquiv = 'refresh'
            meta.content = `0;url=${data.url}`
            document.head.appendChild(meta)
          }
        }, 100)
      } else {
        throw new Error('No redirect URL received')
      }
    } catch (error: any) {
      console.error('Test error:', error)
      setError(`エラー: ${error.message}`)
      setStatus('失敗')
      setLoading(false)
    }
  }

  const testSupabaseConnection = async () => {
    setLoading(true)
    setError('')
    setStatus('接続テスト中...')
    
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setError(`接続エラー: ${error.message}`)
        setStatus('接続失敗')
      } else {
        setStatus('Supabase接続成功')
      }
    } catch (err: any) {
      setError(`接続エラー: ${err.message}`)
      setStatus('接続失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>TeachBid Google認証テスト</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">環境変数確認</h3>
            <p className="text-sm">
              Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定'}
            </p>
            <p className="text-sm">
              Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'}
            </p>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2">テスト結果</h3>
            <p className="mb-2">ステータス: <span className="font-mono">{status}</span></p>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            {status.includes('リダイレクト中') && oauthUrl && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800 mb-3">
                  自動リダイレクトが失敗した場合、以下のボタンをクリックしてください：
                </p>
                <a 
                  href={oauthUrl}
                  className="inline-block px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  クリックしてGoogleログインへ進む
                </a>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={testSupabaseConnection}
              disabled={loading}
              className="w-full"
            >
              Supabase接続テスト
            </Button>
            
            <Button 
              onClick={testGoogleAuth}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Google認証テスト
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">テスト手順</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>まず「Supabase接続テスト」をクリック</li>
              <li>成功したら「Google認証テスト」をクリック</li>
              <li>Googleの認証画面に遷移することを確認</li>
              <li>認証後、このページに戻ってくることを確認</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}