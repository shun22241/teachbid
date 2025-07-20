-- Test data for development

-- Insert categories
INSERT INTO categories (slug, name, name_en, description, icon, color, display_order, meta_title, meta_description, meta_keywords, average_price_min, average_price_max, popular_skills) VALUES
('programming', 'プログラミング', 'Programming', 'Web開発、アプリ開発、AI・機械学習など、現役エンジニアから学ぶ', '💻', '#3B82F6', 1, 
 'プログラミングの家庭教師 | 料金相場とおすすめ講師 | TeachBid', 
 'Python、JavaScript、React等のプログラミングを現役エンジニアから学べます。初心者から上級者まで、目標に合わせた個別指導。無料相談実施中。',
 ARRAY['Python', 'JavaScript', 'React', 'Vue.js', 'TypeScript', 'Java', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin'],
 20000, 80000,
 ARRAY['Python基礎', 'Webアプリ開発', 'スマホアプリ開発', 'AI・機械学習', 'データ分析']),

('language', '語学', 'Language', 'ネイティブ講師や資格保持者による英語・中国語・韓国語等の個別レッスン', '🌍', '#10B981', 2,
 '語学の家庭教師 | オンライン英会話・中国語・韓国語 | TeachBid',
 '英語・中国語・韓国語等をネイティブ講師から学べます。日常会話からビジネス、資格対策まで。TOEIC・HSK対策も対応。',
 ARRAY['英会話', 'ビジネス英語', 'TOEIC', 'TOEFL', '英検', '中国語', 'HSK', '韓国語', 'TOPIK', 'フランス語'],
 15000, 60000,
 ARRAY['日常英会話', 'ビジネス英語', 'TOEIC対策', '中国語会話', '韓国語会話']),

('qualification', '資格・試験', 'Qualification', '簿記、FP、宅建等の資格試験対策を合格実績豊富な講師が指導', '📚', '#F59E0B', 3,
 '資格試験対策の家庭教師 | 簿記・FP・宅建等 | TeachBid',
 '簿記、FP、宅建、行政書士等の資格試験対策。合格実績豊富な講師陣による効率的な個別指導で短期合格を目指します。',
 ARRAY['簿記', '日商簿記', 'FP', 'ファイナンシャルプランナー', '宅建', '宅地建物取引士', '行政書士', '社労士', 'ITパスポート', '基本情報技術者'],
 25000, 100000,
 ARRAY['日商簿記3級', '日商簿記2級', 'FP3級', 'FP2級', '宅建士']),

('creative', 'クリエイティブ', 'Creative', 'デザイン、動画編集、音楽制作等のクリエイティブスキルを学ぶ', '🎨', '#8B5CF6', 4,
 'クリエイティブスキルの家庭教師 | デザイン・動画編集 | TeachBid',
 'Photoshop、Illustrator、動画編集、DTM等のクリエイティブスキルをプロから学べます。作品制作を通じた実践的指導。',
 ARRAY['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Figma', 'デザイン', '動画編集', 'DTM', '作曲', 'イラスト'],
 20000, 70000,
 ARRAY['Webデザイン', 'グラフィックデザイン', '動画編集', 'モーショングラフィックス', 'UI/UXデザイン']),

('business', 'ビジネス', 'Business', 'マーケティング、営業、起業等のビジネススキルを実務経験者から学ぶ', '💼', '#EF4444', 5,
 'ビジネススキルの家庭教師 | マーケティング・営業 | TeachBid',
 'マーケティング、営業、経営戦略等のビジネススキルを実務経験豊富な講師から学べます。起業相談やキャリア相談も対応。',
 ARRAY['マーケティング', 'デジタルマーケティング', '営業', 'プレゼンテーション', '経営戦略', '起業', 'Excel', 'PowerPoint', 'データ分析', 'ビジネス英語'],
 30000, 120000,
 ARRAY['デジタルマーケティング', 'SNSマーケティング', '営業スキル', 'プレゼンスキル', 'Excel実務']);

-- Test users with hashed passwords (password: "password123")
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES
  -- Students
  ('11111111-1111-1111-1111-111111111111', 'student1@test.com', '$2a$10$PkfFGDvB1dXPQHm1Fz.6WuT5Hq9xI8JSAzYH8DDzE2JFRp5eCTqhm', NOW(), 
   '{"role": "student", "display_name": "田中太郎"}', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'student2@test.com', '$2a$10$PkfFGDvB1dXPQHm1Fz.6WuT5Hq9xI8JSAzYH8DDzE2JFRp5eCTqhm', NOW(),
   '{"role": "student", "display_name": "佐藤花子"}', NOW(), NOW()),
  
  -- Teachers
  ('33333333-3333-3333-3333-333333333333', 'teacher1@test.com', '$2a$10$PkfFGDvB1dXPQHm1Fz.6WuT5Hq9xI8JSAzYH8DDzE2JFRp5eCTqhm', NOW(),
   '{"role": "teacher", "display_name": "山田先生"}', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'teacher2@test.com', '$2a$10$PkfFGDvB1dXPQHm1Fz.6WuT5Hq9xI8JSAzYH8DDzE2JFRp5eCTqhm', NOW(),
   '{"role": "teacher", "display_name": "鈴木講師"}', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'teacher3@test.com', '$2a$10$PkfFGDvB1dXPQHm1Fz.6WuT5Hq9xI8JSAzYH8DDzE2JFRp5eCTqhm', NOW(),
   '{"role": "teacher", "display_name": "高橋メンター"}', NOW(), NOW()),
  
  -- Admin
  ('99999999-9999-9999-9999-999999999999', 'admin@test.com', '$2a$10$PkfFGDvB1dXPQHm1Fz.6WuT5Hq9xI8JSAzYH8DDzE2JFRp5eCTqhm', NOW(),
   '{"role": "admin", "display_name": "管理者"}', NOW(), NOW());

-- Update profiles with more details
UPDATE profiles SET
  bio = 'プログラミング学習に興味があります。Pythonで業務効率化ツールを作りたいです。',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE profiles SET
  bio = '英語力を向上させて、グローバルな環境で働きたいと考えています。',
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE profiles SET
  bio = '現役エンジニアとして10年以上の経験があります。Python、JavaScript、Reactが得意です。',
  skills = ARRAY['Python', 'JavaScript', 'React', 'TypeScript', 'Node.js'],
  certifications = ARRAY['基本情報技術者', '応用情報技術者'],
  hourly_rate_min = 3000,
  hourly_rate_max = 5000,
  rating = 4.8,
  rating_count = 24,
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1'
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE profiles SET
  bio = 'TOEIC990点、英検1級保持。ビジネス英語を中心に指導しています。',
  skills = ARRAY['ビジネス英語', 'TOEIC対策', '英会話', 'プレゼンテーション'],
  certifications = ARRAY['TOEIC990点', '英検1級', 'TESOL'],
  hourly_rate_min = 2500,
  hourly_rate_max = 4000,
  rating = 4.9,
  rating_count = 31,
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2'
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE profiles SET
  bio = 'Webデザイナー歴8年。UI/UXデザインとフロントエンド開発を教えています。',
  skills = ARRAY['Figma', 'Photoshop', 'Illustrator', 'HTML/CSS', 'JavaScript'],
  certifications = ARRAY['ウェブデザイン技能検定1級'],
  hourly_rate_min = 3500,
  hourly_rate_max = 6000,
  rating = 4.7,
  rating_count = 18,
  avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3'
WHERE id = '55555555-5555-5555-5555-555555555555';

-- Sample requests
INSERT INTO requests (id, student_id, title, category, subcategory, description, learning_goals, current_level, budget_min, budget_max, duration_weeks, lessons_per_week, lesson_duration_minutes, slug, views, created_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   'Pythonで業務自動化ツールを作りたい',
   'programming',
   'Python',
   '仕事でExcelを使った定型作業が多く、毎日2-3時間を費やしています。PythonでExcelの自動化、データ集計、レポート作成を自動化したいです。プログラミングは完全初心者ですが、3ヶ月で実用的なツールを作れるようになりたいです。',
   ARRAY['Pythonの基礎文法を理解する', 'Excelファイルの読み書きができる', '実際の業務で使える自動化ツールを作る'],
   '初心者',
   30000,
   50000,
   12,
   1,
   60,
   'python-gyomu-jidoka-tool',
   142,
   NOW() - INTERVAL '2 days'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '22222222-2222-2222-2222-222222222222',
   'ビジネス英会話を3ヶ月でマスターしたい',
   'language',
   '英語',
   '外資系企業への転職を検討しており、英語でのミーティングやプレゼンテーションができるレベルを目指しています。現在TOEIC600点程度で、日常会話はなんとかできますが、ビジネスシーンでは不安があります。週2回のレッスンで集中的に学習したいです。',
   ARRAY['ビジネスメールが書ける', '英語でプレゼンテーションができる', '電話会議で積極的に発言できる'],
   '中級',
   40000,
   80000,
   12,
   2,
   60,
   'business-eikaiwa-3months',
   89,
   NOW() - INTERVAL '1 day'),

  ('cccccccc-cccc-cccc-cccc-cccccccccccc',
   '11111111-1111-1111-1111-111111111111',
   'Reactでポートフォリオサイトを作成',
   'programming',
   'React',
   'フロントエンドエンジニアを目指しており、就職活動用のポートフォリオサイトを作りたいです。HTML/CSS/JavaScriptの基礎は理解していますが、Reactは初めてです。モダンなデザインで、実務でも通用するクオリティのサイトを作りたいです。',
   ARRAY['Reactの基本概念を理解', 'コンポーネント設計ができる', 'デプロイまで一人でできる'],
   '初級',
   25000,
   40000,
   8,
   1,
   90,
   'react-portfolio-site',
   67,
   NOW() - INTERVAL '3 days');

-- Sample proposals
INSERT INTO proposals (request_id, teacher_id, amount, message, lesson_plan, created_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '33333333-3333-3333-3333-333333333333',
   35000,
   '現役エンジニアとして、Python自動化の実務経験が豊富です。初心者の方でも分かりやすく、実践的なスキルが身につくようカリキュラムを組んでいます。質問は24時間以内に回答し、確実に目標達成できるようサポートします。',
   E'【カリキュラム】\n第1-2週：Python基礎（変数、関数、制御構文）\n第3-4週：ファイル操作とライブラリの使い方\n第5-6週：openpyxlを使ったExcel操作\n第7-8週：実際の業務を題材にツール作成\n第9-10週：エラー処理とデバッグ\n第11-12週：完成したツールのブラッシュアップ\n\n【特典】\n・オリジナル教材提供\n・サンプルコード集\n・レッスン後の質問対応',
   NOW() - INTERVAL '1 day'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '55555555-5555-5555-5555-555555555555',
   40000,
   'プログラミング初心者への指導経験が豊富です。難しい概念も身近な例えを使って分かりやすく説明します。楽しみながら学べる環境を大切にしており、挫折させません。一緒に頑張りましょう！',
   E'【学習ステップ】\n1. プログラミングの考え方を理解\n2. Pythonの基本文法をゲーム感覚で学習\n3. 小さなプログラムから始めて徐々にレベルアップ\n4. Excel自動化の基礎\n5. 実務で使えるツール開発\n\n毎回の宿題で復習し、確実に身につけます。',
   NOW() - INTERVAL '12 hours'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '44444444-4444-4444-4444-444444444444',
   60000,
   'TOEIC990点、外資系企業での実務経験10年以上あります。ビジネスで実際に使われる表現を中心に、実践的な英語力を身につけていただけます。ロールプレイを多用し、実際のビジネスシーンを想定した練習を行います。',
   E'【12週間集中プログラム】\n\n第1-3週：ビジネス英語の基礎\n・ビジネスメールの書き方\n・電話対応の基本フレーズ\n・自己紹介と会社紹介\n\n第4-6週：会議・ディスカッション\n・意見の述べ方\n・賛成・反対の表現\n・質問と確認の仕方\n\n第7-9週：プレゼンテーション\n・構成の作り方\n・効果的な表現\n・Q&A対応\n\n第10-12週：実践演習\n・模擬会議\n・プレゼン発表\n・最終評価とフィードバック',
   NOW() - INTERVAL '6 hours');

-- Insert some completed transactions for revenue tracking
INSERT INTO transactions (request_id, proposal_id, student_id, teacher_id, amount, fee_rate, fee_amount, net_amount, final_amount, status, completed_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   (SELECT id FROM proposals WHERE request_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1),
   '11111111-1111-1111-1111-111111111111',
   '33333333-3333-3333-3333-333333333333',
   35000,
   0.20,
   7000,
   28000,
   35000,
   'completed',
   NOW() - INTERVAL '1 hour');

-- Add corresponding revenue record
INSERT INTO revenue_records (type, amount, user_id, transaction_id, description)
VALUES
  ('fee',
   7000,
   '33333333-3333-3333-3333-333333333333',
   (SELECT id FROM transactions WHERE request_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1),
   'レッスン手数料（20%）');