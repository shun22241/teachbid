# TeachBid認証問題 - 最終確認ガイド

## 現在の状況
✅ サイトは正常動作中: https://teachbid.vercel.app
✅ ログインページ表示: https://teachbid.vercel.app/auth/login  
✅ テストページ利用可能: https://teachbid.vercel.app/auth/test
✅ デモページ作成済み: https://teachbid.vercel.app/demo

## 🔍 1. Supabase設定の最終確認（最重要）

### Step 1: Supabaseダッシュボードにアクセス
https://supabase.com/dashboard

### Step 2: Authentication → URL Configuration
**確認すべき設定:**
```
Site URL: https://teachbid.vercel.app
```
⚠️ これが未設定または間違っていると認証が失敗します

### Step 3: Authentication → Providers → Google
**確認すべき設定:**
- ✅ Toggle が ON になっているか
- ✅ Client ID: `1015361156322-38uktmsohao0r0honcfta826f3cqdp3f.apps.googleusercontent.com`
- ✅ Client Secret: 設定済みか

### Step 4: Project Settings → API
**メモすべき情報:**
- Project URL（例: https://xxxxx.supabase.co）

## 🔍 2. Google Cloud Consoleの設定確認

### Step 1: Google Cloud Consoleにアクセス
https://console.cloud.google.com

### Step 2: APIs & Services → Credentials
**OAuth 2.0 Client IDの設定確認:**

承認済みのリダイレクトURIに以下が含まれているか：
```
https://teachbid.vercel.app/auth/callback
https://[あなたのSupabaseプロジェクトURL]/auth/v1/callback
```

## 🧪 3. 認証テストの実行

### Step 1: テストページにアクセス
https://teachbid.vercel.app/auth/test

### Step 2: テスト手順
1. 「Supabase接続テスト」をクリック
2. 成功したら「Google認証テスト」をクリック
3. エラーメッセージがあれば記録

## 📋 4. 確認結果報告フォーマット

### Supabase設定
- [ ] Site URL設定済み: https://teachbid.vercel.app
- [ ] Googleプロバイダー有効
- [ ] Client ID設定済み
- [ ] Client Secret設定済み

### Google Cloud Console設定  
- [ ] リダイレクトURI設定済み: https://teachbid.vercel.app/auth/callback
- [ ] Supabase callbackリダイレクトURI設定済み

### テスト結果
- [ ] Supabase接続テスト結果: 
- [ ] Google認証テスト結果:
- [ ] エラーメッセージ（あれば）:

## 🚀 5. 設定変更後の対応

もしSupabase設定を変更した場合：
```bash
cd teachbid
vercel --prod --force
```

## 📞 6. 代替案

認証問題が続く場合：
- デモページ利用: https://teachbid.vercel.app/demo
- デモアカウントでテスト:
  - 生徒: student1@test.com / password123  
  - 講師: teacher1@test.com / password123

## 🔧 7. よくある問題と解決法

### 問題1: "Invalid login credentials"
→ Supabase Site URLの設定確認

### 問題2: Googleログインボタンが反応しない
→ Google Cloud ConsoleのリダイレクトURI確認

### 問題3: "Auth callback error"  
→ SupabaseプロジェクトURLがGoogle Cloud Consoleに設定されているか確認

---

**次のステップ:** 上記確認後、結果をお知らせください。設定に問題があれば具体的な修正手順をご案内します。