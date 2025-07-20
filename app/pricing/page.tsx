import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FEE_RATES, OPTION_PRICES, SUBSCRIPTION_PRICES } from '@/lib/constants/fees'
import Link from 'next/link'
import {
  GraduationCap,
  Check,
  ArrowRight,
  Calculator,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Users,
  Crown
} from 'lucide-react'

export default function PricingPage() {
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
            <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
              使い方
            </Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground">
              カテゴリ
            </Link>
            <Link href="/pricing" className="text-foreground font-medium">
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
                シンプルで分かりやすい料金体系
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                基本機能は完全無料。成功報酬型なので、成果が出た分だけお支払い
              </p>
              <Badge className="text-lg px-4 py-2">
                初期費用・月額費用 完全無料
              </Badge>
            </div>
          </div>
        </section>

        {/* Fee Structure */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                手数料について
              </h2>
              <p className="text-xl text-muted-foreground">
                レッスンが成立した場合のみ、以下の手数料をいただきます
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Fee Calculator */}
              <Card className="mb-12">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    手数料シミュレーター
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">レッスン料金別手数料</h4>
                      <div className="space-y-3">
                        {[
                          { price: 3000, label: "¥3,000" },
                          { price: 5000, label: "¥5,000" },
                          { price: 10000, label: "¥10,000" },
                          { price: 30000, label: "¥30,000" },
                          { price: 50000, label: "¥50,000" },
                          { price: 100000, label: "¥100,000" }
                        ].map(({ price, label }) => {
                          const getFeeRate = (amount: number) => {
                            if (amount < 30000) return FEE_RATES.UNDER_30K
                            if (amount < 50000) return FEE_RATES.UNDER_50K
                            if (amount < 100000) return FEE_RATES.UNDER_100K
                            return FEE_RATES.OVER_100K
                          }
                          
                          const feeRate = getFeeRate(price)
                          const fee = price * feeRate
                          const teacherAmount = price - fee
                          
                          return (
                            <div key={price} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <span className="font-medium">{label}</span>
                              <div className="text-right text-sm">
                                <div>手数料: ¥{fee.toLocaleString()} ({(feeRate * 100).toFixed(0)}%)</div>
                                <div className="text-green-600 font-medium">講師受取: ¥{teacherAmount.toLocaleString()}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">手数料体系</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <span>初回取引</span>
                          <span className="font-medium">{FEE_RATES.FIRST_TIME * 100}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <span>¥30,000未満</span>
                          <span className="font-medium">{FEE_RATES.UNDER_30K * 100}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <span>¥30,000 - ¥50,000</span>
                          <span className="font-medium">{FEE_RATES.UNDER_50K * 100}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <span>¥50,000 - ¥100,000</span>
                          <span className="font-medium">{FEE_RATES.UNDER_100K * 100}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <span>¥100,000以上</span>
                          <span className="font-medium">{FEE_RATES.OVER_100K * 100}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plans */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="h-6 w-6 text-blue-600" />
                        <span>ベーシック</span>
                      </div>
                      <div className="text-3xl font-bold">無料</div>
                      <div className="text-sm text-muted-foreground">基本機能をすべて利用</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">リクエスト投稿・提案受信</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">講師検索・提案作成</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">メッセージ機能</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">レビュー・評価機能</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">基本サポート</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/register">
                        今すぐ始める
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Student Premium */}
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="h-6 w-6 text-primary" />
                        <span>生徒プレミアム</span>
                      </div>
                      <div className="text-3xl font-bold">¥{SUBSCRIPTION_PRICES.STUDENT_PREMIUM.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">月額</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">ベーシックプランの全機能</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm">優先サポート</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm">詳細な学習分析</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm">返金保証制度</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm">講師への直接連絡</span>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/register?plan=student-premium">
                        プレミアムで始める
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Teacher Pro */}
                <Card className="border-secondary">
                  <CardHeader>
                    <CardTitle className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Crown className="h-6 w-6 text-secondary" />
                        <span>講師プロ</span>
                      </div>
                      <div className="text-3xl font-bold">¥{SUBSCRIPTION_PRICES.TEACHER_PRO.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">月額</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">ベーシックプランの全機能</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-secondary" />
                        <span className="text-sm">手数料3%割引</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-secondary" />
                        <span className="text-sm">プロ講師バッジ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-secondary" />
                        <span className="text-sm">提案の優先表示</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-secondary" />
                        <span className="text-sm">詳細な収益分析</span>
                      </div>
                    </div>
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href="/register?plan=teacher-pro">
                        プロで始める
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Optional Services */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                オプションサービス
              </h2>
              <p className="text-xl text-muted-foreground">
                より効果的な学習のための追加サービス
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-orange-600" />
                    緊急リクエスト
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold">¥{OPTION_PRICES.URGENT_LISTING.toLocaleString()}</div>
                    <p className="text-muted-foreground">
                      リクエストを24時間優先表示し、より早く講師からの提案を受け取れます。
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">24時間優先表示</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">通知の優先配信</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">緊急マーク表示</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    提案ブースト
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold">¥{OPTION_PRICES.PROPOSAL_BOOST.toLocaleString()}</div>
                    <p className="text-muted-foreground">
                      講師の提案を生徒により目立つように表示し、選ばれる確率を向上させます。
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">提案の上位表示</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">ハイライト表示</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">おすすめマーク</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                料金に関するよくある質問
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>手数料はいつ支払うのですか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    レッスンが完了し、生徒が満足して決済を確定した時点で、設定された手数料が差し引かれます。事前の支払いは一切ありません。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>返金はできますか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    レッスン開始前であれば全額返金可能です。レッスン開始後の返金は、プラットフォームが仲裁し、妥当と判断された場合に限り部分返金いたします。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>プレミアムプランは必要ですか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    基本機能は無料プランでも十分ご利用いただけます。より充実したサポートや分析機能、手数料割引などをご希望の場合にプレミアムプランをご検討ください。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>講師の報酬はいつ支払われますか？</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    レッスン完了後、生徒の確認を経て通常3-5営業日以内に指定の口座に振り込まれます。初回のみ本人確認が必要となります。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                まずは無料で始めてみませんか？
              </h2>
              <p className="text-xl mb-8">
                登録・基本機能は完全無料。成果が出てから手数料をお支払いいただく安心システム
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/register?role=student">
                    生徒として始める
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/register?role=teacher">
                    講師として始める
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
                <Link href="/how-it-works" className="block text-muted-foreground hover:text-foreground">
                  使い方
                </Link>
                <Link href="/categories" className="block text-muted-foreground hover:text-foreground">
                  カテゴリ
                </Link>
                <Link href="/pricing" className="block text-foreground font-medium">
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