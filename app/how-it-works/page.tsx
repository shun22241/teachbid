import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  GraduationCap,
  Users,
  Search,
  MessageSquare,
  DollarSign,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Shield,
  Zap
} from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TeachBid</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              ホーム
            </Link>
            <Link href="/how-it-works" className="text-foreground font-medium">
              使い方
            </Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground">
              カテゴリ
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              料金
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild>
              <Link href="/register">新規登録</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                TeachBidの使い方
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                生徒と講師、それぞれの立場でのサービス利用方法を詳しく説明します
              </p>
            </div>
          </div>
        </section>

        {/* Student Flow */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4">生徒向け</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                学習を始める4つのステップ
              </h2>
              <p className="text-xl text-muted-foreground">
                簡単な手順で理想の講師と出会えます
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    1
                  </div>
                  <CardTitle>アカウント作成</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    無料でアカウントを作成し、基本情報を登録します
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>メールアドレス登録</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>プロフィール設定</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>学習目標の設定</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    2
                  </div>
                  <CardTitle>リクエスト投稿</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    学習したい内容と条件を詳しく投稿します
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span>学習内容・目標</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>予算範囲</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>希望スケジュール</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    3
                  </div>
                  <CardTitle>提案を比較</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    複数の講師から届く提案を比較検討します
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>講師のプロフィール</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      <span>レッスンプラン</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-600" />
                      <span>評価・レビュー</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    4
                  </div>
                  <CardTitle>学習開始</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    最適な講師を選んで学習を開始します
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>安全な決済</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span>即座に開始</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span>継続サポート</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/register?role=student">
                  生徒として始める
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Teacher Flow */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">講師向け</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                講師として収入を得る4つのステップ
              </h2>
              <p className="text-xl text-muted-foreground">
                あなたの知識とスキルを活かして収入を得ましょう
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    1
                  </div>
                  <CardTitle>講師登録</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    講師として登録し、専門分野を設定します
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-orange-600" />
                      <span>経歴・資格の登録</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      <span>専門分野の選択</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                      <span>希望料金の設定</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    2
                  </div>
                  <CardTitle>リクエスト検索</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    あなたの専門分野に合うリクエストを探します
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-600" />
                      <span>カテゴリ別検索</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>スケジュール確認</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>予算範囲の確認</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    3
                  </div>
                  <CardTitle>提案作成</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    具体的なレッスンプランと料金を提案します
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      <span>自己紹介</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span>カリキュラム提案</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <span>料金設定</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    4
                  </div>
                  <CardTitle>指導開始</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    提案が承認されたら指導を開始し、収入を得ます
                  </p>
                  <div className="space-y-2 text-sm text-left">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span>即座に開始</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>安全な報酬受取</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-600" />
                      <span>評価で信頼度UP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register?role=teacher">
                  講師として始める
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                従来サービスとの違い
              </h2>
              <p className="text-xl text-muted-foreground">
                TeachBidが革新的な理由
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-muted-foreground">従来の家庭教師サービス</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                      <span className="text-red-600 text-sm">×</span>
                    </div>
                    <div>
                      <p className="font-medium">固定料金</p>
                      <p className="text-sm text-muted-foreground">講師や内容に関係なく一律料金</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                      <span className="text-red-600 text-sm">×</span>
                    </div>
                    <div>
                      <p className="font-medium">選択肢が限定的</p>
                      <p className="text-sm text-muted-foreground">提示された講師から選ぶだけ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                      <span className="text-red-600 text-sm">×</span>
                    </div>
                    <div>
                      <p className="font-medium">画一的なサービス</p>
                      <p className="text-sm text-muted-foreground">個人のニーズに合わせにくい</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6 text-primary">TeachBid</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">競争による最適価格</p>
                      <p className="text-sm text-muted-foreground">複数の講師が競争して最適な料金を提案</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">豊富な選択肢</p>
                      <p className="text-sm text-muted-foreground">多様な講師から最適な相手を選択</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">オーダーメイド学習</p>
                      <p className="text-sm text-muted-foreground">あなただけのカスタマイズされたプラン</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                よくある質問
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>利用料金はかかりますか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    アカウント登録や基本的な機能の利用は無料です。実際にレッスンが成立した場合のみ、手数料として取引金額の15-25%をいただきます。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>どのような講師が登録していますか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    現役のエンジニア、研究者、教員、学生など、様々な分野の専門家が登録しています。全ての講師は登録時に経歴や資格を確認し、適切なレビューシステムで品質を維持しています。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>オンラインと対面、どちらでも利用できますか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    はい。リクエスト投稿時にオンライン、対面、または両方対応可能を選択できます。講師側も対応可能な形式を指定できるため、お互いの希望に合った学習スタイルを選択できます。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>支払いはいつ行われますか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    講師を選択した時点で決済が行われ、レッスン完了後に講師に報酬が支払われます。万が一のトラブルに備えて、一時的にプラットフォームで資金をお預かりする仕組みになっています。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                さあ、始めましょう
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                TeachBidで新しい学習体験を始めませんか？
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/register?role=student">
                    生徒として登録
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/register?role=teacher">
                    講師として登録
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">TeachBid</span>
              </div>
              <p className="text-muted-foreground text-sm">
                逆オークション型オンライン家庭教師マッチングサービス
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">サービス</h3>
              <div className="space-y-2 text-sm">
                <Link href="/how-it-works" className="block text-foreground font-medium">
                  使い方
                </Link>
                <Link href="/categories" className="block text-muted-foreground hover:text-foreground">
                  カテゴリ
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground">
                  料金
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">アカウント</h3>
              <div className="space-y-2 text-sm">
                <Link href="/login" className="block text-muted-foreground hover:text-foreground">
                  ログイン
                </Link>
                <Link href="/register" className="block text-muted-foreground hover:text-foreground">
                  新規登録
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">サポート</h3>
              <div className="space-y-2 text-sm">
                <Link href="/help" className="block text-muted-foreground hover:text-foreground">
                  ヘルプ
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                  お問い合わせ
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-foreground">
                  利用規約
                </Link>
                <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
                  プライバシーポリシー
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TeachBid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}