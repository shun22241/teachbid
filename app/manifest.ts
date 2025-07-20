import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TeachBid - 逆オークション型オンライン家庭教師マッチング',
    short_name: 'TeachBid',
    description: '生徒が学習目標と予算を投稿し、先生が競争入札する逆オークション型マッチングサービス',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'learning', 'tutoring'],
    lang: 'ja',
    dir: 'ltr',
    orientation: 'portrait-primary',
  }
}