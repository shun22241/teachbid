import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { PWAInitializer } from "@/components/pwa/PWAInitializer";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://teachbid.com"),
  title: {
    template: "%s | TeachBid",
    default: "TeachBid - 逆オークション型オンライン家庭教師マッチング",
  },
  description: "生徒が学習目標と予算を投稿し、先生が競争入札する逆オークション型マッチングサービス。プログラミング、語学、資格試験対策など幅広い分野で最適な講師を見つけられます。",
  keywords: ["オンライン家庭教師", "個別指導", "スキルアップ", "資格取得", "プログラミング学習", "語学学習", "逆オークション", "教育マッチング"],
  authors: [{ name: "TeachBid" }],
  creator: "TeachBid",
  publisher: "TeachBid",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "TeachBid - 逆オークション型オンライン家庭教師マッチング",
    description: "生徒が学習目標と予算を投稿し、先生が競争入札する逆オークション型マッチングサービス",
    siteName: "TeachBid",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TeachBid",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TeachBid - 逆オークション型オンライン家庭教師マッチング",
    description: "生徒が学習目標と予算を投稿し、先生が競争入札する逆オークション型マッチングサービス",
    images: ["/twitter-image.png"],
    creator: "@teachbid",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster />
            <WebVitalsReporter />
            <PWAInstallPrompt />
            <PWAInitializer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
