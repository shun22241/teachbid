export default function TeacherDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">講師ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">今月の収益</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">¥85,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">完了レッスン</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">新規提案</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">7</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">クイックアクション</h2>
        <div className="space-y-3">
          <a href="/dashboard/teacher/browse" 
             className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600">
            新しいリクエストを探す
          </a>
          <a href="/dashboard/teacher/proposals" 
             className="block p-4 bg-green-500 text-white rounded hover:bg-green-600">
            提案を管理
          </a>
          <a href="/dashboard/teacher/messages" 
             className="block p-4 bg-purple-500 text-white rounded hover:bg-purple-600">
            メッセージを確認
          </a>
          <a href="/dashboard/teacher/earnings" 
             className="block p-4 bg-orange-500 text-white rounded hover:bg-orange-600">
            収益を確認
          </a>
        </div>
      </div>
    </div>
  )
}