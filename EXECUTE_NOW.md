# 🚀 EXECUTE NOW - 実行手順

## 現在の状況
✅ **認証ユーザー**: 両方のデモユーザーがSupabaseに存在  
✅ **アプリケーション**: 本番環境デプロイ済み  
❌ **データベース**: profilesテーブルが未作成  

## 🎯 今すぐ実行する手順

### ステップ1: Supabaseダッシュボードにアクセス
```
https://jmkcostjyceaoycgfxib.supabase.co
```

### ステップ2: SQL Editorで以下を実行
**SQL Editor** → **New Query** → 以下をコピー&ペースト → **Run**

```sql
-- FINAL SETUP: TeachBid Demo Login Enable
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  display_name TEXT,
  bio TEXT,
  skills TEXT[],
  hourly_rate_min INTEGER,
  hourly_rate_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

INSERT INTO profiles (id, email, role, display_name, bio, created_at, updated_at) VALUES 
('44415ea5-8bf3-41ef-b272-7ac5880ab3ae', 'student1@test.com', 'student', 'デモ生徒', 'TeachBidのデモ用生徒アカウントです。プログラミングと数学を学習したいと思っています。', NOW(), NOW()),
('175be6d0-c932-4277-b9ba-63c35ddc7d6e', 'teacher1@test.com', 'teacher', 'デモ講師', 'TeachBidのデモ用講師アカウントです。プログラミングと数学の指導が得意です。', ARRAY['プログラミング', '数学', 'Python', 'JavaScript'], 2000, 5000, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, display_name = EXCLUDED.display_name, bio = EXCLUDED.bio, skills = EXCLUDED.skills, hourly_rate_min = EXCLUDED.hourly_rate_min, hourly_rate_max = EXCLUDED.hourly_rate_max, updated_at = NOW();

SELECT '🎉 DEMO SETUP COMPLETE!' as status;
SELECT email, role, display_name FROM profiles WHERE email LIKE '%@test.com';
```

### ステップ3: 即座にテスト
```
https://teachbid-nbeyjw58u-shunya5566-gmailcoms-projects.vercel.app/auth/login
```

**デモアカウント:**
- 📚 **生徒**: student1@test.com / password123
- 👨‍🏫 **講師**: teacher1@test.com / password123

### 期待される結果
✅ ログイン成功  
✅ 生徒 → `/dashboard/student/dashboard` にリダイレクト  
✅ 講師 → `/dashboard/teacher/dashboard` にリダイレクト  
✅ プロフィール情報表示  
✅ ロール基盤ナビゲーション動作  

## 🔧 トラブルシューティング

### もしログインが失敗する場合:
1. **ブラウザコンソール**を開く (F12)
2. 以下をコンソールで実行:
```javascript
// プロフィールテーブル確認
supabase.from('profiles').select('*').then(console.log)

// 認証状態確認  
supabase.auth.getUser().then(console.log)
```

### もしプロフィールが見つからない場合:
SQL Editorで確認:
```sql
SELECT * FROM profiles WHERE email IN ('student1@test.com', 'teacher1@test.com');
SELECT * FROM auth.users WHERE email IN ('student1@test.com', 'teacher1@test.com');
```

## 📋 最終チェックリスト
- [ ] Supabaseダッシュボードにアクセス
- [ ] SQL実行完了
- [ ] student1@test.com ログインテスト
- [ ] teacher1@test.com ログインテスト  
- [ ] ダッシュボード機能確認
- [ ] プロフィール表示確認

実行完了後、TeachBidのデモ機能が完全に動作します！