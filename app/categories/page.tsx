import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CATEGORIES } from '@/lib/constants/categories'
import Link from 'next/link'
import {
  GraduationCap,
  Search,
  ArrowRight,
  Users,
  BookOpen,
  TrendingUp
} from 'lucide-react'

export default function CategoriesPage() {
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
            <Link href="/categories" className="text-foreground font-medium">
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
                学習カテゴリ一覧
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                プログラミングから語学まで、幅広い分野の専門講師が待っています
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="カテゴリやスキルで検索..."
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {CATEGORIES.map((category) => (
                <Card key={category.slug} className="hover:shadow-lg transition-all duration-300 hover:scale-105" asChild>
                  <Link href={`/categories/${category.slug}`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${category.color}15`, color: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Popular Skills */}
                        <div>
                          <h4 className="font-medium mb-3 text-sm">人気のスキル</h4>
                          <div className="flex flex-wrap gap-2">
                            {category.subcategories.slice(0, 6).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {category.subcategories.length > 6 && (
                              <Badge variant="outline" className="text-xs">
                                +{category.subcategories.length - 6}個
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>200+ 講師</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>500+ レッスン</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>詳細を見る</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                特に人気のカテゴリ
              </h2>
              <p className="text-xl text-muted-foreground">
                多くの生徒に選ばれている学習分野
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {CATEGORIES.slice(0, 3).map((category, index) => (
                <Card key={category.slug} className="text-center relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary">
                      #{index + 1}
                    </Badge>
                  </div>
                  <CardHeader className="pb-6">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                      style={{ backgroundColor: `${category.color}15`, color: category.color }}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">300+</div>
                        <div className="text-sm text-muted-foreground">講師数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">1,200+</div>
                        <div className="text-sm text-muted-foreground">完了レッスン</div>
                      </div>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/categories/${category.slug}`}>
                        詳細を見る
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Choose */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                カテゴリの選び方
              </h2>
              <p className="text-xl text-muted-foreground">
                あなたに最適な学習分野を見つけるコツ
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>目標を明確にする</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    「何のために学ぶのか」「どのレベルまで達したいのか」を明確にしてからカテゴリを選びましょう。
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>基礎から応用まで</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    各カテゴリには初心者から上級者まで対応した講師がいます。現在のレベルに合わせて選択できます。
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>講師の質をチェック</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    各カテゴリページで講師の経歴や評価を確認し、あなたのニーズに合った講師を見つけましょう。
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
                学びたい分野は見つかりましたか？
              </h2>
              <p className="text-xl mb-8">
                今すぐリクエストを投稿して、専門講師からの提案を受け取りましょう
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/register?role=student">
                    リクエストを投稿
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/how-it-works">
                    使い方を見る
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
                <Link href="/categories" className="block text-foreground font-medium">
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