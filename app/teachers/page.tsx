import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default async function TeachersPage() {
  let connectionStatus = 'Unknown'
  let teachers: any[] = []
  let error: string | null = null

  try {
    // Supabase接続テスト
    const supabase = createClient()
    console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // 簡単なクエリでテスト
    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'teacher')
      .limit(5)

    if (queryError) {
      throw queryError
    }

    connectionStatus = 'Success'
    teachers = data || []
  } catch (err: any) {
    connectionStatus = 'Failed'
    error = err.message
    console.error('Database connection error:', err)
    
    // フォールバックのモックデータ
    teachers = [
      { id: 1, full_name: 'テスト講師1 (mock)' },
      { id: 2, full_name: 'テスト講師2 (mock)' },
      { id: 3, full_name: 'テスト講師3 (mock)' },
    ]
  }
  
  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-8'>講師一覧</h1>
      
      <div className='mb-6 p-4 border rounded'>
        <h2 className='text-lg font-semibold mb-2'>接続状況</h2>
        <p className={`mb-2 ${connectionStatus === 'Success' ? 'text-green-600' : 'text-red-600'}`}>
          データベース接続: {connectionStatus}
        </p>
        {error && (
          <p className='text-red-600 text-sm'>エラー: {error}</p>
        )}
      </div>
      
      <div className='grid gap-4'>
        {teachers.map(teacher => (
          <div key={teacher.id} className='p-4 border rounded shadow'>
            <h2 className='text-xl font-semibold'>{teacher.full_name}</h2>
            <p className='text-gray-600'>ID: {teacher.id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}