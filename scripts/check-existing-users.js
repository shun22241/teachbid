const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('=== Checking Existing Auth Users ===\n')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkUsers() {
  console.log('Testing both demo account logins...\n')
  
  // Test student login
  console.log('1. Testing student1@test.com...')
  try {
    const { data: studentAuth, error: studentError } = await supabase.auth.signInWithPassword({
      email: 'student1@test.com',
      password: 'password123'
    })
    
    if (studentError) {
      console.log('❌ Student login failed:', studentError.message)
    } else {
      console.log('✅ Student login successful!')
      console.log('   ID:', studentAuth.user?.id)
      console.log('   Email:', studentAuth.user?.email)
      console.log('   Created:', studentAuth.user?.created_at)
    }
    
    // Sign out to test teacher
    await supabase.auth.signOut()
    
  } catch (error) {
    console.log('❌ Student test error:', error.message)
  }
  
  console.log('')
  
  // Test teacher login
  console.log('2. Testing teacher1@test.com...')
  try {
    const { data: teacherAuth, error: teacherError } = await supabase.auth.signInWithPassword({
      email: 'teacher1@test.com',
      password: 'password123'
    })
    
    if (teacherError) {
      console.log('❌ Teacher login failed:', teacherError.message)
      if (teacherError.message.includes('Invalid login credentials')) {
        console.log('   → Teacher user does not exist in auth.users')
        console.log('   → Need to create manually in Supabase Dashboard')
      }
    } else {
      console.log('✅ Teacher login successful!')
      console.log('   ID:', teacherAuth.user?.id)
      console.log('   Email:', teacherAuth.user?.email)
      console.log('   Created:', teacherAuth.user?.created_at)
    }
    
    await supabase.auth.signOut()
    
  } catch (error) {
    console.log('❌ Teacher test error:', error.message)
  }
  
  console.log('\n=== Summary ===')
  console.log('Next steps based on results:')
  console.log('1. Run minimal-setup.sql in Supabase SQL Editor')
  console.log('2. If teacher login failed, create teacher1@test.com manually')
  console.log('3. Test actual app login')
}

checkUsers().then(() => {
  console.log('\n=== Check Complete ===')
  process.exit(0)
}).catch(error => {
  console.error('Check failed:', error)
  process.exit(1)
})