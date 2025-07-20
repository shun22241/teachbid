# TeachBid - 逆オークション型オンライン家庭教師マッチングサービス

![TeachBid Logo](https://via.placeholder.com/400x100/3B82F6/FFFFFF?text=TeachBid)

## 🎯 プロジェクト概要

TeachBidは、生徒が学習目標と予算を投稿し、講師が競争入札で提案する革新的な家庭教師マッチングプラットフォームです。従来の家庭教師サービスとは異なり、逆オークション方式により最適な価格とサービスを実現します。

## ✨ 主要機能

### 🎓 学習者（生徒）向け機能
- **リクエスト投稿**: 学習内容、目標、予算、スケジュールを投稿
- **提案比較**: 複数講師からの提案を比較検討
- **安全な決済**: Stripe統合による安全な支払いシステム
- **リアルタイムチャット**: 講師との直接コミュニケーション
- **レビュー・評価**: 講師の評価とフィードバック
- **学習履歴**: 過去のレッスンと進捗管理

### 👨‍🏫 講師向け機能
- **リクエスト閲覧**: 条件に合う学習リクエストの検索
- **競争入札**: 価格と内容で差別化した提案作成
- **収益管理**: Stripe Connectによる自動収益管理
- **スケジュール管理**: 柔軟なスケジュール設定
- **プロフィール強化**: 専門性と実績のアピール
- **生徒管理**: 複数生徒との効率的なコミュニケーション

### 🛡️ 管理機能
- **ユーザー管理**: 学生・講師・管理者の役割管理
- **取引監視**: 決済とサービス提供の追跡
- **品質管理**: レビューと評価システム
- **分析ダッシュボード**: ビジネスメトリクスとKPI
- **紛争解決**: トラブル時のサポート機能

## 🏗️ 技術スタック

### フロントエンド
- **Next.js 14** - React フレームワーク（App Router）
- **TypeScript 5** - 型安全性
- **Tailwind CSS 3** - ユーティリティファーストCSS
- **shadcn/ui** - モダンなUIコンポーネント
- **Lucide React** - アイコンライブラリ
- **React Hook Form + Zod** - フォーム管理と検証

### バックエンド
- **Supabase** - PostgreSQL データベース + 認証
- **Row Level Security (RLS)** - データベースセキュリティ
- **Real-time Subscriptions** - リアルタイム機能
- **Stripe** - 決済処理（Payment Intents + Connect）

### 開発・運用
- **Jest + React Testing Library** - ユニットテスト
- **Playwright** - E2Eテスト
- **PWA対応** - オフライン機能とインストール
- **SEO最適化** - メタデータとサイトマップ
- **国際化（i18n）** - 日本語・英語対応
- **アナリティクス** - ビジネスメトリクス追跡

## 🚀 セットアップ手順

### 前提条件
- Node.js 18.17以上
- npm または yarn
- Supabaseアカウント
- Stripeアカウント

### 1. プロジェクトのクローン
```bash
git clone <repository-url>
cd teachbid
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
cp .env.local.example .env.local
```

`.env.local`を編集して以下の値を設定：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (オプション)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-key
```

### 4. データベースセットアップ
```bash
# Supabase CLIを使用
npx supabase db reset

# または手動でSQLファイルを実行
# supabase/migrations/ 内のファイルを順番に実行
```

### 5. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 📁 プロジェクト構造

```
teachbid/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   ├── dashboard/         # ダッシュボード
│   ├── api/               # API ルート
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── auth/             # 認証コンポーネント
│   ├── dashboard/        # ダッシュボードコンポーネント
│   ├── requests/         # リクエスト関連
│   ├── proposals/        # 提案関連
│   ├── messages/         # メッセージング
│   ├── payments/         # 決済関連
│   ├── reviews/          # レビューシステム
│   ├── notifications/    # 通知システム
│   ├── analytics/        # 分析機能
│   └── pwa/              # PWA機能
├── lib/                  # ユーティリティとライブラリ
├── hooks/                # カスタムReactフック
├── types/                # TypeScript型定義
├── supabase/             # データベース関連
├── __tests__/            # テストファイル
└── public/               # 静的ファイル
```

## 🧪 テスト

### ユニットテスト
```bash
npm run test
npm run test:watch  # ウォッチモード
```

### E2Eテスト
```bash
npm run test:e2e
```

### 型チェック
```bash
npm run type-check
```

## 💰 料金システム

### 手数料体系
- 10,000円未満: 25%
- 10,000円〜50,000円: 20%
- 50,000円〜100,000円: 18%
- 100,000円以上: 15%

## 🌐 国際化対応

### 対応言語
- 日本語（デフォルト）
- 英語

## 📱 PWA機能

### 対応機能
- オフライン閲覧
- プッシュ通知
- ホーム画面インストール
- バックグラウンド同期

## 🚀 デプロイ

### Vercel デプロイ
```bash
npm run build
npx vercel --prod
```

---

**TeachBid** - 学習を革新する逆オークション型プラットフォーム 🎓✨
