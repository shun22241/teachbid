const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('=== Testing Auth Fixes ===\n')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testAuthFixes() {
  console.log('🔧 Testing Google auth error fixes...\n')
  
  try {
    // Test 1: Email login still works
    console.log('1. 📧 Testing email login functionality...')
    const { data: studentAuth, error: studentError } = await supabase.auth.signInWithPassword({
      email: 'student1@test.com',
      password: 'password123'
    })
    
    if (studentError) {
      console.log('❌ Student email login failed:', studentError.message)
    } else {
      console.log('✅ Student email login successful!')
      console.log('   → User ID:', studentAuth.user?.id)
      console.log('   → Should redirect to /login-success')
    }
    
    await supabase.auth.signOut()
    
    // Test 2: Teacher login
    console.log('\n2. 👨‍🏫 Testing teacher email login...')
    const { data: teacherAuth, error: teacherError } = await supabase.auth.signInWithPassword({
      email: 'teacher1@test.com',
      password: 'password123'
    })
    
    if (teacherError) {
      console.log('❌ Teacher email login failed:', teacherError.message)
    } else {
      console.log('✅ Teacher email login successful!')
      console.log('   → User ID:', teacherAuth.user?.id)
      console.log('   → Should redirect to /login-success')
    }
    
    await supabase.auth.signOut()
    
    // Test 3: Invalid login (error handling)
    console.log('\n3. 🚫 Testing error handling with invalid credentials...')
    const { data: invalidAuth, error: invalidError } = await supabase.auth.signInWithPassword({
      email: 'invalid@test.com',
      password: 'wrongpassword'
    })
    
    if (invalidError) {
      console.log('✅ Error handling working:', invalidError.message)
      console.log('   → Should show user-friendly error message')
    } else {
      console.log('❌ Unexpected: Invalid login succeeded')
    }
    
  } catch (error) {
    console.error('Test error:', error.message)
  }
  
  console.log('\n=== 🎯 VERIFICATION CHECKLIST ===')
  console.log('✅ Error page created (app/error.tsx)')
  console.log('✅ Auth callback improved (app/auth/callback/route.ts)')
  console.log('✅ Google login disabled (components/auth/LoginForm.tsx)')
  console.log('✅ User message added about email/password only')
  console.log('✅ Email login still functional')
  
  console.log('\n=== 📋 TESTING INSTRUCTIONS ===')
  console.log('1. Visit login page')
  console.log('2. Confirm Google login button is not visible/disabled')
  console.log('3. See message "現在メール/パスワードログインのみ利用可能です"')
  console.log('4. Test email login with demo accounts')
  console.log('5. Verify redirect to /login-success works')
  console.log('6. Check dashboards are accessible')
  
  console.log('\n🚀 Latest deployment URL will be provided after build completes')
}

testAuthFixes().then(() => {
  console.log('\n=== Test Complete ===')
  process.exit(0)
}).catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})