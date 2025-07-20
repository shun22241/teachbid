# Vercelデプロイ手順

## 🚀 ワンクリックデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshun22241%2Fteachbid&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXTAUTH_SECRET,SUPABASE_SERVICE_ROLE_KEY&envDescription=TeachBid%20requires%20Supabase%20configuration%20for%20authentication%20and%20database&project-name=teachbid&repository-name=teachbid)

## 📋 手動デプロイ手順

### 1. Vercelアカウント設定
1. [vercel.com](https://vercel.com) にアクセス
2. "Continue with GitHub" でログイン

### 2. プロジェクトインポート
1. "New Project" をクリック
2. `shun22241/teachbid` リポジトリを選択
3. "Import" をクリック

### 3. 環境変数設定
以下の環境変数を**必ず**設定してください：

```bash
# 1. Supabase（必須）
NEXT_PUBLIC_SUPABASE_URL=https://jmkcostjyceaoycgfxib.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impta2Nvc3RqeWNlYW95Y2dmeGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODgxOTUsImV4cCI6MjA2ODU2NDE5NX0.eMvVXLee6A5YhofAGjjs5xD44R8vneP6kCq01-VVrC8

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impta2Nvc3RqeWNlYW95Y2dmeGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODgxOTUsImV4cCI6MjA2ODU2NDE5NX0.eMvVXLee6A5YhofAGjjs5xD44R8vneP6kCq01-VVrC8

# 2. 認証用シークレット（必須）
NEXTAUTH_SECRET=CYyJve8LdQeHmV+MXcNk93itXWMYcRsfOSSxcKGJp/g=

# 3. アプリケーション設定（Vercelが自動設定）
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=TeachBid
```

### 4. デプロイ実行
1. "Deploy" ボタンをクリック
2. 約2-3分でデプロイ完了
3. 自動生成されたURLでアクセス確認

## 🔧 デプロイ後の設定

### 1. カスタムドメイン（オプション）
1. Vercelダッシュボード > "Domains"
2. カスタムドメインを追加
3. DNS設定でCNAMEレコードを追加

### 2. 環境変数の更新
デプロイ完了後、以下を更新：
```bash
NEXTAUTH_URL=https://teachbid.com  # 実際のドメインに変更
NEXT_PUBLIC_APP_URL=https://teachbid.com
```

## 📊 本番環境機能

### ✅ 有効な機能
- レスポンシブ UI/UX
- PWA機能（オフライン対応）
- 日本語完全対応
- SEO最適化
- セキュリティヘッダー

### 🔄 自動更新
- GitHubプッシュで自動デプロイ
- プレビューデプロイ対応
- ロールバック機能

## 🚨 トラブルシューティング

### ビルドエラーの場合
1. ローカルで `npm run build` を実行
2. TypeScript エラー: `npm run type-check`
3. 環境変数の確認

### 実行時エラーの場合
1. Vercel Function Logs を確認
2. Supabase接続確認
3. 環境変数の値確認

## 📱 アクセス確認

デプロイ完了後、以下のページで動作確認：
- `/` - トップページ
- `/demo` - デモダッシュボード
- `/login` - ログインページ

**🎉 デプロイ完了後、TeachBidが本番環境で稼働します！**