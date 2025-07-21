const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('=== Login Simulation Test ===\n')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testLogin() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Test 1: Check if profiles table exists
    console.log('\n1. Testing profiles table access...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message)
      console.log('   This confirms profiles table does not exist yet.')
    } else {
      console.log('✅ Profiles table accessible!')
      console.log('   Sample data:', profiles)
    }
    
    // Test 2: Simulate login attempt
    console.log('\n2. Testing login simulation...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'student1@test.com',
      password: 'password123'
    })
    
    if (authError) {
      console.log('❌ Login error:', authError.message)
      if (authError.message.includes('Invalid login credentials')) {
        console.log('   → User does not exist in auth.users')
      } else if (authError.message.includes('Email not confirmed')) {
        console.log('   → User exists but email not confirmed')
      }
    } else {
      console.log('✅ Login successful!')
      console.log('   User ID:', authData.user?.id)
      console.log('   Email:', authData.user?.email)
      
      // Test profile fetch
      console.log('\n3. Testing profile fetch...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', authData.user.id)
        .single()
      
      if (profileError) {
        console.log('❌ Profile fetch error:', profileError.message)
      } else {
        console.log('✅ Profile found:', profile)
      }
    }
    
    // Test 3: Check demo user profiles directly
    console.log('\n4. Testing demo profile lookup...')
    const { data: demoProfiles, error: demoError } = await supabase
      .from('profiles')
      .select('id, email, role, display_name')
      .in('email', ['student1@test.com', 'teacher1@test.com'])
    
    if (demoError) {
      console.log('❌ Demo profiles error:', demoError.message)
    } else {
      console.log('✅ Demo profiles found:', demoProfiles?.length || 0)
      if (demoProfiles && demoProfiles.length > 0) {
        demoProfiles.forEach(profile => {
          console.log(`   - ${profile.email}: ${profile.role} (${profile.display_name})`)
        })
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

console.log('Environment check:')
console.log('- Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('- Anon key configured:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log('')

testLogin().then(() => {
  console.log('\n=== Test Complete ===')
  console.log('\nNext steps:')
  console.log('1. Run minimal-setup.sql in Supabase SQL Editor')
  console.log('2. Create auth users in Supabase Dashboard')
  console.log('3. Test login on the actual app')
  process.exit(0)
}).catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})