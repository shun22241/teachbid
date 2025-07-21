import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Mail, Phone, Clock, MapPin } from 'lucide-react'

export const metadata = {
  title: 'お問い合わせ - TeachBid',
  description: 'TeachBidに関するお問い合わせはこちらから。'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              トップページに戻る
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">お問い合わせ</CardTitle>
                <p className="text-muted-foreground">
                  ご質問やご不明な点がございましたら、お気軽にお問い合わせください。
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">姓 *</Label>
                      <Input id="lastName" placeholder="山田" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">名 *</Label>
                      <Input id="firstName" placeholder="太郎" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス *</Label>
                    <Input id="email" type="email" placeholder="example@teachbid.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">電話番号（任意）</Label>
                    <Input id="phone" type="tel" placeholder="090-1234-5678" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">お問い合わせ種別 *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">サービスについて</SelectItem>
                        <SelectItem value="account">アカウントについて</SelectItem>
                        <SelectItem value="payment">お支払いについて</SelectItem>
                        <SelectItem value="technical">技術的な問題</SelectItem>
                        <SelectItem value="partnership">事業提携について</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">件名 *</Label>
                    <Input id="subject" placeholder="お問い合わせの件名を入力してください" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">お問い合わせ内容 *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="お問い合わせ内容を詳しくご記入ください"
                      className="min-h-[120px]"
                      required 
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="privacy" className="rounded" required />
                      <Label htmlFor="privacy" className="text-sm">
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          プライバシーポリシー
                        </Link>
                        に同意します *
                      </Label>
                    </div>

                    <Button type="submit" className="w-full">
                      お問い合わせを送信
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">お問い合わせ先</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">メール</p>
                    <p className="text-sm text-muted-foreground">support@teachbid.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">電話</p>
                    <p className="text-sm text-muted-foreground">03-1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">受付時間</p>
                    <p className="text-sm text-muted-foreground">
                      平日 9:00-18:00<br />
                      （土日祝日を除く）
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">所在地</p>
                    <p className="text-sm text-muted-foreground">
                      〒150-0001<br />
                      東京都渋谷区神宮前1-1-1<br />
                      TeachBidビル 5F
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">よくある質問</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  お問い合わせの前に、よくある質問もご確認ください。
                </p>
                <Button variant="outline" className="w-full">
                  FAQを見る
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-blue-900">緊急時のお問い合わせ</h3>
                  <p className="text-sm text-blue-700">
                    サービスに関する緊急のお問い合わせは、
                    24時間対応のサポートチャットをご利用ください。
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    チャットサポート
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}