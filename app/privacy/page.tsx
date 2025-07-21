import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'プライバシーポリシー - TeachBid',
  description: 'TeachBidのプライバシーポリシーをご確認ください。'
}

export default function PrivacyPage() {
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

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">プライバシーポリシー</CardTitle>
            <p className="text-muted-foreground">最終更新日: 2024年7月21日</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">個人情報の取得</h2>
              <p className="text-sm leading-relaxed">
                当社は、個人情報を取得する際は、利用目的を明確にし、適法かつ公正な手段によって
                個人情報を取得いたします。当社が取得する個人情報は以下の通りです：
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li>お名前、メールアドレス、電話番号</li>
                <li>学習履歴、指導履歴</li>
                <li>決済情報（クレジットカード情報等）</li>
                <li>サービス利用に関するログ情報</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">個人情報の利用目的</h2>
              <p className="text-sm leading-relaxed">
                当社は、取得した個人情報を以下の目的で利用いたします：
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li>本サービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに回答するため</li>
                <li>ユーザーにご連絡するため</li>
                <li>料金の請求・決済のため</li>
                <li>本サービスの改善・新機能の開発のため</li>
                <li>メンテナンス、重要なお知らせなど必要に応じた連絡のため</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">個人情報の安全管理</h2>
              <p className="text-sm leading-relaxed">
                当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために
                必要かつ適切な措置を講じます。当社は、個人情報を取り扱う従業者や委託先に対して、
                必要かつ適切な監督を行います。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">個人情報の第三者提供</h2>
              <p className="text-sm leading-relaxed">
                当社は、個人情報保護法その他の法令に基づき開示が認められる場合を除き、
                あらかじめユーザーの同意を得ないで、個人情報を第三者に提供することはありません。
                ただし、以下の場合はこの限りではありません：
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のため特に必要がある場合</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Cookie（クッキー）について</h2>
              <p className="text-sm leading-relaxed">
                当社のウェブサイトでは、サービス向上のためにCookieを使用しています。
                Cookieとは、ウェブサイトがお客様のコンピュータに送信する小さなファイルで、
                お客様がウェブサイトを再訪問された際にお客様を認識するために使用されます。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">個人情報の開示・訂正等</h2>
              <p className="text-sm leading-relaxed">
                ユーザーは、当社の保有する自己の個人情報について、開示、訂正、追加、削除、
                利用停止、消去および第三者提供の停止を希望される場合には、
                お問い合わせフォームにてご連絡ください。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">プライバシーポリシーの変更</h2>
              <p className="text-sm leading-relaxed">
                当社は、必要に応じて、このプライバシーポリシーの内容を変更することがあります。
                この場合、変更後のプライバシーポリシーの施行時期と内容を適切な方法により
                周知または通知します。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">お問い合わせ窓口</h2>
              <p className="text-sm leading-relaxed">
                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします：
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p className="text-sm">
                  <strong>TeachBid 個人情報保護担当</strong><br />
                  Email: privacy@teachbid.com<br />
                  受付時間: 平日 9:00-18:00
                </p>
              </div>
            </section>

            <div className="pt-6 border-t">
              <p className="text-center text-sm text-muted-foreground">
                個人情報に関するお問い合わせは、
                <Link href="/contact" className="text-blue-600 hover:underline">
                  お問い合わせフォーム
                </Link>
                からもお送りいただけます。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}