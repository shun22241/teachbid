export default function StudentDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">生徒ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">受講済みレッスン</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">今月の予約</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">お気に入り講師</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">5</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">クイックアクション</h2>
        <div className="space-y-3">
          <a href="/dashboard/student/requests/new" 
             className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600">
            新しいリクエストを作成
          </a>
          <a href="/teachers" 
             className="block p-4 bg-green-500 text-white rounded hover:bg-green-600">
            講師を探す
          </a>
          <a href="/dashboard/student/messages" 
             className="block p-4 bg-purple-500 text-white rounded hover:bg-purple-600">
            メッセージを確認
          </a>
        </div>
      </div>
    </div>
  )
}