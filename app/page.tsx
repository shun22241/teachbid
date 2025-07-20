import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GraduationCap,
  Users,
  Target,
  ArrowRight,
  Zap,
  BookOpen,
  Calculator,
  Music,
  Palette,
  Trophy,
  Briefcase,
  Heart
} from 'lucide-react'

const categories = [
  { name: 'プログラミング', icon: '💻', color: '#3B82F6', description: 'Web開発、アプリ開発、AI・機械学習' },
  { name: '語学', icon: '🌍', color: '#10B981', description: '英語、中国語、韓国語、日本語' },
  { name: '音楽', icon: '🎵', color: '#8B5CF6', description: 'ピアノ、ギター、ボーカル、作曲' },
  { name: '美術・デザイン', icon: '🎨', color: '#F59E0B', description: 'イラスト、グラフィックデザイン、写真' },
  { name: 'スポーツ', icon: '⚽', color: '#EF4444', description: 'サッカー、テニス、水泳、フィットネス' },
  { name: '資格・試験対策', icon: '📚', color: '#6366F1', description: 'TOEIC、簿記、IT資格、公務員試験' },
  { name: 'ビジネス', icon: '💼', color: '#059669', description: 'マーケティング、経営、財務、起業' },
  { name: '趣味・教養', icon: '🎭', color: '#DC2626', description: '料理、園芸、手芸、歴史' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">TeachBid</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-gray-500 hover:text-gray-900">カテゴリー</Link>
              <Link href="/how-it-works" className="text-gray-500 hover:text-gray-900">使い方</Link>
              <Link href="/pricing" className="text-gray-500 hover:text-gray-900">料金</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline">ログイン</Button>
              <Button>新規登録</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            逆オークション型<br />
            <span className="text-blue-600">オンライン家庭教師</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            学習したい内容と予算を投稿するだけ。経験豊富な講師が競争入札であなたに最適な提案をします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              学習を始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              講師として参加
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              TeachBidが選ばれる理由
            </h2>
            <p className="text-xl text-gray-600">
              従来の家庭教師サービスとは違う、新しい学習体験
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>逆オークション方式</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  あなたの学習ニーズと予算に合わせて、複数の講師が競争して最適な提案をします。
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>厳選された講師陣</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  実務経験豊富なプロフェッショナルから現役学生まで、様々な分野の専門家が在籍。
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>柔軟な学習スタイル</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  オンライン・対面どちらでも対応。あなたの都合に合わせた学習スケジュールで進められます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              幅広い学習分野に対応
            </h2>
            <p className="text-xl text-gray-600">
              あなたの学びたい分野がきっと見つかります
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-left text-lg">{category.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              簡単3ステップで学習開始
            </h2>
            <p className="text-xl text-gray-600">
              面倒な手続きは一切なし。今すぐ始められます
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">リクエスト投稿</h3>
              <p className="text-gray-600">
                学習したい内容、目標、予算、希望スケジュールを投稿
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">提案を受ける</h3>
              <p className="text-gray-600">
                複数の講師から具体的なレッスンプランと料金の提案が届く
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">学習開始</h3>
              <p className="text-gray-600">
                最適な講師を選んで、あなただけのオーダーメイド学習をスタート
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg">
              今すぐ無料で始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-blue-200">登録講師数</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-200">完了レッスン</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-blue-200">平均評価</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-200">目標達成率</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold">TeachBid</span>
              </div>
              <p className="text-gray-400 text-sm">
                逆オークション型オンライン家庭教師マッチングサービス
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">サービス</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>使い方</div>
                <div>カテゴリ</div>
                <div>料金</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">アカウント</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>ログイン</div>
                <div>新規登録</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">サポート</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>ヘルプ</div>
                <div>お問い合わせ</div>
                <div>利用規約</div>
                <div>プライバシーポリシー</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 TeachBid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}