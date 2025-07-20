export const CATEGORIES = [
  {
    slug: 'programming',
    name: 'プログラミング',
    nameEn: 'Programming',
    icon: '💻',
    color: '#3B82F6',
    description: 'Web開発、アプリ開発、AI・機械学習など、現役エンジニアから学ぶ',
    subcategories: [
      'Python',
      'JavaScript',
      'React',
      'Vue.js',
      'TypeScript',
      'Java',
      'PHP',
      'Ruby',
      'Go',
      'Swift',
      'Kotlin',
      'AI・機械学習',
      'データ分析'
    ]
  },
  {
    slug: 'language',
    name: '語学',
    nameEn: 'Language',
    icon: '🌍',
    color: '#10B981',
    description: 'ネイティブ講師や資格保持者による英語・中国語・韓国語等の個別レッスン',
    subcategories: [
      '英語',
      '中国語',
      '韓国語',
      'フランス語',
      'ドイツ語',
      'スペイン語',
      'イタリア語',
      'その他'
    ]
  },
  {
    slug: 'qualification',
    name: '資格・試験',
    nameEn: 'Qualification',
    icon: '📚',
    color: '#F59E0B',
    description: '簿記、FP、宅建等の資格試験対策を合格実績豊富な講師が指導',
    subcategories: [
      '日商簿記',
      'FP（ファイナンシャルプランナー）',
      '宅地建物取引士',
      '行政書士',
      '社会保険労務士',
      'ITパスポート',
      '基本情報技術者',
      '応用情報技術者',
      'TOEIC',
      'TOEFL',
      '英検',
      'その他'
    ]
  },
  {
    slug: 'creative',
    name: 'クリエイティブ',
    nameEn: 'Creative',
    icon: '🎨',
    color: '#8B5CF6',
    description: 'デザイン、動画編集、音楽制作等のクリエイティブスキルを学ぶ',
    subcategories: [
      'Webデザイン',
      'グラフィックデザイン',
      'UI/UXデザイン',
      '動画編集',
      'モーショングラフィックス',
      'イラスト',
      '写真',
      '音楽制作',
      'DTM',
      '3DCG'
    ]
  },
  {
    slug: 'business',
    name: 'ビジネス',
    nameEn: 'Business',
    icon: '💼',
    color: '#EF4444',
    description: 'マーケティング、営業、起業等のビジネススキルを実務経験者から学ぶ',
    subcategories: [
      'マーケティング',
      'デジタルマーケティング',
      'SNSマーケティング',
      '営業',
      'プレゼンテーション',
      '経営戦略',
      '起業・創業',
      'Excel実務',
      'PowerPoint',
      'データ分析',
      'プロジェクトマネジメント'
    ]
  }
] as const

export const CATEGORY_SLUGS = CATEGORIES.map(cat => cat.slug)
export type CategorySlug = typeof CATEGORY_SLUGS[number]

export const getCategoryBySlug = (slug: string) => {
  return CATEGORIES.find(cat => cat.slug === slug)
}

export const getSubcategoriesByCategory = (categorySlug: string) => {
  const category = getCategoryBySlug(categorySlug)
  return category?.subcategories || []
}