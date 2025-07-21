const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('=== Supabase Configuration Check ===\n')

// Check environment variables
console.log('Environment Variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)
console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length)
console.log('Keys are same:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === process.env.SUPABASE_SERVICE_ROLE_KEY)
console.log('')

// Test connection with anon key
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkSupabaseStatus() {
  try {
    console.log('=== Testing Anon Key Access ===')
    
    // Test profiles table access
    const { data: profiles, error: profilesError } = await supabaseAnon
      .from('profiles')
      .select('id, email, role')
      .limit(5)
    
    if (profilesError) {
      console.log('Profiles access error:', profilesError.message)
    } else {
      console.log('Profiles found:', profiles?.length || 0)
      if (profiles && profiles.length > 0) {
        console.log('Sample profiles:', profiles)
      }
    }
    
    // Check for demo users specifically
    const { data: demoUsers, error: demoError } = await supabaseAnon
      .from('profiles')
      .select('id, email, role, display_name')
      .in('email', ['student1@test.com', 'teacher1@test.com'])
    
    if (demoError) {
      console.log('Demo users check error:', demoError.message)
    } else {
      console.log('Demo users found:', demoUsers?.length || 0)
      if (demoUsers && demoUsers.length > 0) {
        console.log('Demo users:', demoUsers)
      }
    }
    
    console.log('\n=== Testing Auth Users Access ===')
    
    // Try to access auth.users (this might fail with anon key)
    const { data: authUsers, error: authError } = await supabaseAnon
      .from('auth.users')
      .select('id, email')
      .in('email', ['student1@test.com', 'teacher1@test.com'])
    
    if (authError) {
      console.log('Auth users access error (expected with anon key):', authError.message)
    } else {
      console.log('Auth users found:', authUsers?.length || 0)
    }
    
    console.log('\n=== Testing Service Role Key ===')
    
    // Test with service role key (if it's different)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY !== process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      
      const { data: serviceUsers, error: serviceError } = await supabaseService.auth.admin.listUsers()
      
      if (serviceError) {
        console.log('Service role key test error:', serviceError.message)
      } else {
        console.log('Service role key working. Total users:', serviceUsers.users?.length || 0)
        const demoAuthUsers = serviceUsers.users?.filter(user => 
          user.email === 'student1@test.com' || user.email === 'teacher1@test.com'
        )
        console.log('Demo auth users found:', demoAuthUsers?.length || 0)
        if (demoAuthUsers && demoAuthUsers.length > 0) {
          console.log('Demo auth users:', demoAuthUsers.map(u => ({ id: u.id, email: u.email })))
        }
      }
    } else {
      console.log('Service role key is same as anon key - need proper service role key from Supabase dashboard')
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

// Run the check
checkSupabaseStatus().then(() => {
  console.log('\n=== Check Complete ===')
  process.exit(0)
}).catch(error => {
  console.error('Check failed:', error)
  process.exit(1)
})