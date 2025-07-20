# TeachBid デプロイメントガイド

## 🚀 本番環境デプロイオプション

### Option 1: Vercel（推奨）

#### 1. Supabaseプロジェクト作成
1. [Supabase](https://supabase.com)でアカウント作成
2. 新しいプロジェクトを作成
3. Settings > API で以下を取得：
   - `Project URL`
   - `anon public key`

#### 2. Vercelでデプロイ
1. [Vercel](https://vercel.com)でアカウント作成
2. GitHubリポジトリをインポート
3. 環境変数を設定：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXTAUTH_SECRET=random-secret-string
   ```
4. デプロイ実行

#### 3. ドメイン設定
- Vercelダッシュボードでカスタムドメインを設定
- DNS設定でCNAMEレコードを追加

### Option 2: Docker + VPS

#### 1. VPSでのセットアップ
```bash
# サーバーにSSH接続
ssh user@your-server.com

# Docker インストール
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# プロジェクトクローン
git clone https://github.com/your-username/teachbid.git
cd teachbid

# 環境変数設定
cp .env.production.example .env.production
# .env.production を編集

# Docker ビルド & 起動
docker build -t teachbid .
docker run -d -p 3000:3000 --env-file .env.production teachbid
```

#### 2. Nginx リバースプロキシ設定
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: AWS Amplify

#### 1. Amplify での設定
1. AWS Amplifyコンソールでアプリ作成
2. GitHubリポジトリを接続
3. ビルド設定：
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## 🔧 必要な環境変数

### 必須
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase プロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `NEXTAUTH_SECRET`: JWT署名用シークレット

### オプション
- `STRIPE_PUBLISHABLE_KEY`: Stripe 公開キー
- `STRIPE_SECRET_KEY`: Stripe シークレットキー
- `GOOGLE_ANALYTICS_ID`: Google Analytics測定ID

## 📊 パフォーマンス最適化

### 1. 画像最適化
- Next.js Image コンポーネント使用済み
- WebP/AVIF フォーマット対応

### 2. バンドル最適化
- SWC minification 有効
- Tree shaking 有効
- パッケージインポート最適化

### 3. セキュリティ
- Security headers 設定済み
- HTTPS 強制
- XSS 保護

## 🔍 監視・ログ

### Vercel Analytics
```javascript
// _app.tsx に追加
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### Google Analytics
```javascript
// Google Analytics設定済み
// GOOGLE_ANALYTICS_ID 環境変数を設定するだけ
```

## 🚨 トラブルシューティング

### ビルドエラー
1. TypeScript エラー: `npm run type-check`
2. Lint エラー: `npm run lint`
3. 依存関係: `npm ci` で再インストール

### 本番環境エラー
1. 環境変数確認
2. Supabase接続確認
3. ログ確認（Vercel Function Logs）

## 📱 PWA 設定

TeachBidはPWA対応済み：
- Service Worker 自動生成
- アプリインストール対応
- オフライン機能

## 🔄 継続的デプロイ

GitHub Actions設定済み：
- main ブランチプッシュで自動デプロイ
- TypeScript/Lint チェック
- ビルド確認