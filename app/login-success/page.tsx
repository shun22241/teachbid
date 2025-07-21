export default function LoginSuccessPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">ログイン成功！</h1>
      <div className="mt-4 space-y-2">
        <a href="/dashboard/student/dashboard" className="block p-4 bg-blue-500 text-white rounded">
          生徒ダッシュボードへ
        </a>
        <a href="/dashboard/teacher/dashboard" className="block p-4 bg-green-500 text-white rounded">
          講師ダッシュボードへ
        </a>
      </div>
    </div>
  )
}