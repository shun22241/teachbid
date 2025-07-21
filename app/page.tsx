import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Lightbulb, Target } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-gray-900 mb-6'>
            TeachBid
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            逆オークション型オンライン家庭教師マッチングプラットフォーム
          </p>
          <p className='text-lg text-gray-500 mb-12'>
            生徒が学習目標と予算を投稿し、先生が競争入札するマッチングサービス
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/auth/register'>
              <Button size='lg' className='w-full sm:w-auto'>
                今すぐ始める
              </Button>
            </Link>
            <Link href='/auth/login'>
              <Button variant='outline' size='lg' className='w-full sm:w-auto'>
                ログイン
              </Button>
            </Link>
          </div>

          <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                <BookOpen className='h-8 w-8 text-blue-600' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>学習リクエスト</h3>
              <p className='text-gray-600'>学習目標と予算を投稿</p>
            </div>
            
            <div className='text-center'>
              <div className='bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                <Lightbulb className='h-8 w-8 text-green-600' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>講師の提案</h3>
              <p className='text-gray-600'>専門講師が競争入札</p>
            </div>
            
            <div className='text-center'>
              <div className='bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
                <Target className='h-8 w-8 text-purple-600' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>最適マッチング</h3>
              <p className='text-gray-600'>理想の講師を選択</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}