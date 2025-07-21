import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '利用規約 - TeachBid',
  description: 'TeachBidの利用規約をご確認ください。'
}

export default function TermsPage() {
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
            <CardTitle className="text-2xl">利用規約</CardTitle>
            <p className="text-muted-foreground">最終更新日: 2024年7月21日</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3">第1条（適用）</h2>
              <p className="text-sm leading-relaxed">
                本利用規約（以下「本規約」といいます。）は、TeachBid（以下「当社」といいます。）が
                提供するオンライン家庭教師マッチングサービス「TeachBid」（以下「本サービス」といいます。）の
                利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」といいます。）には、
                本規約に従って、本サービスをご利用いただきます。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第2条（利用登録）</h2>
              <p className="text-sm leading-relaxed">
                本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって
                利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第3条（ユーザーIDおよびパスワードの管理）</h2>
              <p className="text-sm leading-relaxed">
                ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを
                適切に管理するものとします。ユーザーは、いかなる場合にも、ユーザーIDおよび
                パスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第4条（料金および支払方法）</h2>
              <p className="text-sm leading-relaxed">
                ユーザーは、本サービスの有料部分の対価として、当社が別途定め、
                本ウェブサイトに表示する料金を、当社が指定する方法により支払うものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第5条（禁止事項）</h2>
              <p className="text-sm leading-relaxed">
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません：
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>本サービスの内容等、本サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為</li>
                <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>本サービスによって得られた情報を商業的に利用する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第6条（本サービスの提供の停止等）</h2>
              <p className="text-sm leading-relaxed">
                当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく
                本サービスの全部または一部の提供を停止または中断することができるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第7条（著作権）</h2>
              <p className="text-sm leading-relaxed">
                ユーザーは、自ら著作権等の必要な知的財産権を有するか、または必要な権利者の
                許諾を得た文章、画像や映像等の情報に関してのみ、本サービスを利用し、
                投稿ないしアップロードすることができるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第8条（利用規約の変更）</h2>
              <p className="text-sm leading-relaxed">
                当社は、必要と判断した場合には、ユーザーに通知することなく
                いつでも本規約を変更することができるものとします。なお、本規約の変更後、
                本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に
                同意したものとみなします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">第9条（準拠法・裁判管轄）</h2>
              <p className="text-sm leading-relaxed">
                本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が
                生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-center text-sm text-muted-foreground">
                本規約について不明な点がございましたら、
                <Link href="/contact" className="text-blue-600 hover:underline">
                  お問い合わせ
                </Link>
                ください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}