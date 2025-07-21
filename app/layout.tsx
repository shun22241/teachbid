import './globals.css'
import { Inter } from 'next/font/google'
import { ClientProviders } from '@/components/client-providers'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'TeachBid',
  description: 'Teaching platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}