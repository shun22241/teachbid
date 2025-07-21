const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('=== Testing Simplified Login Flow ===\n')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testSimplifiedFlow() {
  console.log('🚀 Production URL: https://teachbid-49aeux3h3-shunya5566-gmailcoms-projects.vercel.app\n')
  
  try {
    // Test 1: Student login
    console.log('1. 📚 Testing student login flow...')
    const { data: studentAuth, error: studentError } = await supabase.auth.signInWithPassword({
      email: 'student1@test.com',
      password: 'password123'
    })
    
    if (studentError) {
      console.log('❌ Student login failed:', studentError.message)
    } else {
      console.log('✅ Student login successful!')
      console.log('   → Should redirect to /login-success')
      console.log('   → From there, can access /dashboard/student/dashboard')
    }
    
    await supabase.auth.signOut()
    
    // Test 2: Teacher login
    console.log('\n2. 👨‍🏫 Testing teacher login flow...')
    const { data: teacherAuth, error: teacherError } = await supabase.auth.signInWithPassword({
      email: 'teacher1@test.com',
      password: 'password123'
    })
    
    if (teacherError) {
      console.log('❌ Teacher login failed:', teacherError.message)
    } else {
      console.log('✅ Teacher login successful!')
      console.log('   → Should redirect to /login-success')
      console.log('   → From there, can access /dashboard/teacher/dashboard')
    }
    
    await supabase.auth.signOut()
    
  } catch (error) {
    console.error('Test error:', error.message)
  }
  
  console.log('\n=== 🎯 TESTING INSTRUCTIONS ===')
  console.log('1. Go to: https://teachbid-49aeux3h3-shunya5566-gmailcoms-projects.vercel.app/auth/login')
  console.log('2. Try student1@test.com / password123')
  console.log('3. Should redirect to /login-success')
  console.log('4. Click "生徒ダッシュボードへ" → Should show student dashboard')
  console.log('5. Go back and try teacher1@test.com / password123')
  console.log('6. Should redirect to /login-success')
  console.log('7. Click "講師ダッシュボードへ" → Should show teacher dashboard')
  
  console.log('\n✅ Expected behavior:')
  console.log('- Login always succeeds (no profile dependency)')
  console.log('- Always redirects to /login-success')  
  console.log('- Dashboards work with fallback demo data')
  console.log('- No authentication barriers')
  
  console.log('\n🔧 If any issues:')
  console.log('- Check browser console for errors')
  console.log('- Verify URLs are accessible')
  console.log('- Check if middleware is disabled')
}

testSimplifiedFlow().then(() => {
  console.log('\n=== Test Complete ===')
  process.exit(0)
}).catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})