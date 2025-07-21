// Success messages
export const SUCCESS_MESSAGES = {
  REQUEST_CREATED: 'リクエストを投稿しました。講師からの提案をお待ちください。',
  PROPOSAL_SUBMITTED: '提案を送信しました。生徒からの返信をお待ちください。',
  PROPOSAL_ACCEPTED: '提案が承認されました。レッスンの準備を進めてください。',
  PROFILE_UPDATED: 'プロフィールを更新しました。',
  PAYMENT_COMPLETED: '決済が完了しました。',
  REVIEW_SUBMITTED: 'レビューを投稿しました。',
  PASSWORD_CHANGED: 'パスワードを変更しました。',
  EMAIL_VERIFIED: 'メールアドレスの認証が完了しました。',
  NOTIFICATION_SENT: '通知を送信しました。',
  ACCOUNT_CREATED: 'アカウントの作成が完了しました。',
} as const

// Error messages
export const ERROR_MESSAGES = {
  // General
  UNKNOWN_ERROR: '予期しないエラーが発生しました。',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。',
  SERVER_ERROR: 'サーバーエラーが発生しました。',
  
  // Authentication
  INVALID_CREDENTIALS: 'メールアドレスまたはパスワードが正しくありません。',
  USER_NOT_FOUND: 'ユーザーが見つかりません。',
  EMAIL_ALREADY_EXISTS: 'このメールアドレスは既に使用されています。',
  WEAK_PASSWORD: 'パスワードは8文字以上である必要があります。',
  UNAUTHORIZED: 'ログインが必要です。',
  FORBIDDEN: 'アクセス権限がありません。',
  
  // Validation
  REQUIRED_FIELD: 'この項目は必須です。',
  INVALID_EMAIL: '有効なメールアドレスを入力してください。',
  INVALID_URL: '有効なURLを入力してください。',
  INVALID_PHONE: '有効な電話番号を入力してください。',
  MIN_LENGTH: '文字数が足りません。',
  MAX_LENGTH: '文字数が上限を超えています。',
  INVALID_NUMBER: '有効な数値を入力してください。',
  MIN_VALUE: '値が最小値を下回っています。',
  MAX_VALUE: '値が最大値を超えています。',
  
  // Business logic
  BUDGET_INVALID: '予算の最小値は最大値より小さくする必要があります。',
  PROPOSAL_AMOUNT_INVALID: '提案金額は予算範囲内である必要があります。',
  REQUEST_NOT_FOUND: 'リクエストが見つかりません。',
  PROPOSAL_NOT_FOUND: '提案が見つかりません。',
  ALREADY_PROPOSED: 'このリクエストには既に提案済みです。',
  REQUEST_CLOSED: 'このリクエストは既に終了しています。',
  INSUFFICIENT_FUNDS: '残高が不足しています。',
  PAYMENT_FAILED: '決済に失敗しました。',
  CANNOT_PROPOSE_OWN_REQUEST: '自分のリクエストには提案できません。',
  
  // File upload
  FILE_TOO_LARGE: 'ファイルサイズが大きすぎます。',
  INVALID_FILE_TYPE: 'サポートされていないファイル形式です。',
  UPLOAD_FAILED: 'ファイルのアップロードに失敗しました。',
} as const

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUEST: {
    TITLE_REQUIRED: 'タイトルは必須です。',
    TITLE_MAX_LENGTH: 'タイトルは100文字以内で入力してください。',
    DESCRIPTION_REQUIRED: '詳細は必須です。',
    DESCRIPTION_MAX_LENGTH: '詳細は2000文字以内で入力してください。',
    CATEGORY_REQUIRED: 'カテゴリーを選択してください。',
    LEARNING_GOALS_REQUIRED: '学習目標を1つ以上入力してください。',
    BUDGET_MIN_REQUIRED: '予算の最小値は必須です。',
    BUDGET_MAX_REQUIRED: '予算の最大値は必須です。',
    BUDGET_MIN_VALUE: '予算の最小値は1,000円以上である必要があります。',
    BUDGET_RANGE_INVALID: '予算の最小値は最大値以下である必要があります。',
  },
  
  PROPOSAL: {
    AMOUNT_REQUIRED: '提案金額は必須です。',
    AMOUNT_MIN_VALUE: '提案金額は1,000円以上である必要があります。',
    MESSAGE_REQUIRED: 'メッセージは必須です。',
    MESSAGE_MIN_LENGTH: 'メッセージは50文字以上で入力してください。',
    MESSAGE_MAX_LENGTH: 'メッセージは1000文字以内で入力してください。',
    LESSON_PLAN_REQUIRED: 'レッスンプランは必須です。',
    LESSON_PLAN_MAX_LENGTH: 'レッスンプランは2000文字以内で入力してください。',
  },
  
  PROFILE: {
    DISPLAY_NAME_REQUIRED: '表示名は必須です。',
    DISPLAY_NAME_MAX_LENGTH: '表示名は50文字以内で入力してください。',
    BIO_MAX_LENGTH: '自己紹介は1000文字以内で入力してください。',
    HOURLY_RATE_MIN_VALUE: '時給の最小値は500円以上である必要があります。',
    HOURLY_RATE_RANGE_INVALID: '時給の最小値は最大値以下である必要があります。',
  },
  
  REVIEW: {
    RATING_REQUIRED: '評価は必須です。',
    RATING_RANGE: '評価は1から5の間で選択してください。',
    COMMENT_MAX_LENGTH: 'コメントは500文字以内で入力してください。',
  },
} as const

// Notification messages
export const NOTIFICATION_MESSAGES = {
  NEW_PROPOSAL: '新しい提案が届きました',
  PROPOSAL_ACCEPTED: 'あなたの提案が承認されました',
  PROPOSAL_REJECTED: 'あなたの提案が却下されました',
  PAYMENT_RECEIVED: '支払いを受け取りました',
  LESSON_COMPLETED: 'レッスンが完了しました',
  REVIEW_RECEIVED: '新しいレビューが投稿されました',
  REQUEST_EXPIRED: 'リクエストの期限が切れました',
  ACCOUNT_VERIFIED: 'アカウント認証が完了しました',
  WELCOME: 'TeachBidへようこそ！',
} as const

// Confirmation messages
export const CONFIRMATION_MESSAGES = {
  DELETE_REQUEST: 'このリクエストを削除してもよろしいですか？',
  CANCEL_REQUEST: 'このリクエストをキャンセルしてもよろしいですか？',
  WITHDRAW_PROPOSAL: 'この提案を取り下げてもよろしいですか？',
  ACCEPT_PROPOSAL: 'この提案を承認してもよろしいですか？',
  REJECT_PROPOSAL: 'この提案を却下してもよろしいですか？',
  DELETE_ACCOUNT: 'アカウントを削除してもよろしいですか？この操作は取り消せません。',
  LOGOUT: 'ログアウトしてもよろしいですか？',
  PROCESS_PAYMENT: '決済を実行してもよろしいですか？',
} as const

// Status labels
export const STATUS_LABELS = {
  REQUEST: {
    open: '募集中',
    matched: 'マッチング済み',
    in_progress: '進行中',
    completed: '完了',
    cancelled: 'キャンセル',
  },
  PROPOSAL: {
    pending: '審査中',
    accepted: '承認済み',
    rejected: '却下',
    withdrawn: '取り下げ',
  },
  TRANSACTION: {
    pending: '保留中',
    processing: '処理中',
    completed: '完了',
    failed: '失敗',
    refunded: '返金済み',
  },
} as const

// Loading messages
export const LOADING_MESSAGES = {
  LOADING: '読み込み中...',
  SAVING: '保存中...',
  UPLOADING: 'アップロード中...',
  PROCESSING: '処理中...',
  SUBMITTING: '送信中...',
  AUTHENTICATING: '認証中...',
  PLEASE_WAIT: 'しばらくお待ちください...',
} as const

// Combined messages object for convenience
export const MESSAGES = {
  SUCCESS: SUCCESS_MESSAGES,
  ERROR: ERROR_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
  NOTIFICATION: NOTIFICATION_MESSAGES,
  CONFIRMATION: CONFIRMATION_MESSAGES,
  STATUS: STATUS_LABELS,
  LOADING: LOADING_MESSAGES,
} as const