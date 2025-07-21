const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('=== Creating Auth Users with Specific UUIDs ===\n')

// You need to get the proper Service Role Key from Supabase Dashboard
// Go to Settings > API and copy the service_role key (not the anon key)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY // Update this with real service role key

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAuthUsers() {
  try {
    console.log('Creating auth users with specific UUIDs...\n')
    
    // Student user with specific UUID
    console.log('Creating student user...')
    const { data: student, error: studentError } = await supabase.auth.admin.createUser({
      user_id: '11111111-1111-1111-1111-111111111111',
      email: 'student1@test.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        role: 'student',
        display_name: 'デモ生徒'
      }
    })
    
    if (studentError) {
      console.error('❌ Student creation error:', studentError.message)
    } else {
      console.log('✅ Student created:', student.user?.email, 'ID:', student.user?.id)
    }
    
    // Teacher user with specific UUID
    console.log('\nCreating teacher user...')
    const { data: teacher, error: teacherError } = await supabase.auth.admin.createUser({
      user_id: '22222222-2222-2222-2222-222222222222',
      email: 'teacher1@test.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        role: 'teacher',
        display_name: 'デモ講師'
      }
    })
    
    if (teacherError) {
      console.error('❌ Teacher creation error:', teacherError.message)
    } else {
      console.log('✅ Teacher created:', teacher.user?.email, 'ID:', teacher.user?.id)
    }
    
    console.log('\n=== Verification ===')
    
    // List all users to verify
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      console.error('❌ List users error:', listError.message)
    } else {
      console.log('Total users:', users.users?.length)
      const demoUsers = users.users?.filter(u => u.email?.includes('@test.com'))
      console.log('Demo users:', demoUsers?.map(u => ({ email: u.email, id: u.id })))
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

// Check if we have proper service role key
if (SERVICE_ROLE_KEY === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('⚠️  WARNING: Service role key is same as anon key!')
  console.log('Please update SUPABASE_SERVICE_ROLE_KEY in .env.local with the proper service role key from Supabase Dashboard.')
  console.log('Go to: Settings > API > service_role key')
  process.exit(1)
}

createAuthUsers().then(() => {
  console.log('\n✅ Auth users creation completed!')
  process.exit(0)
}).catch(error => {
  console.error('❌ Script failed:', error)
  process.exit(1)
})