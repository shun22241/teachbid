export default function LoginSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ログイン成功！</h1>
          <p className="text-gray-600 mb-6">TeachBidへようこそ</p>
          
          <div className="space-y-3">
            <a 
              href="/dashboard/student/dashboard" 
              className="block w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📚 生徒ダッシュボードへ
            </a>
            <a 
              href="/dashboard/teacher/dashboard" 
              className="block w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              👨‍🏫 講師ダッシュボードへ
            </a>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            ※ デモ用アカウントでサービスをお試しください
          </p>
        </div>
      </div>
    </div>
  )
}