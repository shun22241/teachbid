const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('=== TeachBid Setup Verification ===\n')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function verifySetup() {
  let allChecks = {
    profilesTable: false,
    studentProfile: false,
    teacherProfile: false,
    studentLogin: false,
    teacherLogin: false
  }

  try {
    // Check 1: Profiles table exists and has data
    console.log('1. 📋 Checking profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role, display_name')
      .in('email', ['student1@test.com', 'teacher1@test.com'])
    
    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message)
      console.log('   → Need to run final-setup.sql in Supabase Dashboard')
    } else {
      console.log('✅ Profiles table accessible!')
      allChecks.profilesTable = true
      
      if (profiles && profiles.length > 0) {
        console.log('   Found profiles:', profiles.length)
        profiles.forEach(profile => {
          console.log(`   - ${profile.email}: ${profile.role} (${profile.display_name})`)
          if (profile.email === 'student1@test.com') allChecks.studentProfile = true
          if (profile.email === 'teacher1@test.com') allChecks.teacherProfile = true
        })
      } else {
        console.log('   ⚠️  No demo profiles found')
      }
    }

    // Check 2: Student login test
    console.log('\n2. 📚 Testing student login...')
    try {
      const { data: studentAuth, error: studentError } = await supabase.auth.signInWithPassword({
        email: 'student1@test.com',
        password: 'password123'
      })
      
      if (studentError) {
        console.log('❌ Student login failed:', studentError.message)
      } else {
        console.log('✅ Student login successful!')
        console.log('   User ID:', studentAuth.user?.id)
        allChecks.studentLogin = true
        
        // Test profile fetch for student
        if (allChecks.profilesTable) {
          const { data: studentProfile, error: profileError } = await supabase
            .from('profiles')
            .select('role, display_name')
            .eq('id', studentAuth.user.id)
            .single()
          
          if (profileError) {
            console.log('   ⚠️  Profile fetch error:', profileError.message)
          } else {
            console.log(`   ✅ Profile: ${studentProfile.role} - ${studentProfile.display_name}`)
          }
        }
      }
      
      await supabase.auth.signOut()
    } catch (error) {
      console.log('❌ Student login test error:', error.message)
    }

    // Check 3: Teacher login test
    console.log('\n3. 👨‍🏫 Testing teacher login...')
    try {
      const { data: teacherAuth, error: teacherError } = await supabase.auth.signInWithPassword({
        email: 'teacher1@test.com',
        password: 'password123'
      })
      
      if (teacherError) {
        console.log('❌ Teacher login failed:', teacherError.message)
      } else {
        console.log('✅ Teacher login successful!')
        console.log('   User ID:', teacherAuth.user?.id)
        allChecks.teacherLogin = true
        
        // Test profile fetch for teacher
        if (allChecks.profilesTable) {
          const { data: teacherProfile, error: profileError } = await supabase
            .from('profiles')
            .select('role, display_name, skills, hourly_rate_min, hourly_rate_max')
            .eq('id', teacherAuth.user.id)
            .single()
          
          if (profileError) {
            console.log('   ⚠️  Profile fetch error:', profileError.message)
          } else {
            console.log(`   ✅ Profile: ${teacherProfile.role} - ${teacherProfile.display_name}`)
            console.log(`   💰 Rate: ¥${teacherProfile.hourly_rate_min}-${teacherProfile.hourly_rate_max}/hour`)
            console.log(`   🛠️  Skills: ${teacherProfile.skills?.join(', ') || 'None'}`)
          }
        }
      }
      
      await supabase.auth.signOut()
    } catch (error) {
      console.log('❌ Teacher login test error:', error.message)
    }

  } catch (error) {
    console.error('Verification error:', error.message)
  }

  // Summary
  console.log('\n=== 📊 VERIFICATION SUMMARY ===')
  const passedChecks = Object.values(allChecks).filter(check => check).length
  const totalChecks = Object.keys(allChecks).length
  
  console.log(`Status: ${passedChecks}/${totalChecks} checks passed`)
  console.log('')
  
  Object.entries(allChecks).forEach(([check, passed]) => {
    const status = passed ? '✅' : '❌'
    const checkNames = {
      profilesTable: 'Profiles table accessible',
      studentProfile: 'Student profile exists',
      teacherProfile: 'Teacher profile exists', 
      studentLogin: 'Student login works',
      teacherLogin: 'Teacher login works'
    }
    console.log(`${status} ${checkNames[check]}`)
  })

  if (passedChecks === totalChecks) {
    console.log('\n🎉 ALL CHECKS PASSED! Demo login is ready!')
    console.log('🚀 Test at: https://teachbid-nbeyjw58u-shunya5566-gmailcoms-projects.vercel.app/auth/login')
  } else {
    console.log('\n⚠️  Some checks failed. Run final-setup.sql in Supabase Dashboard.')
  }

  return passedChecks === totalChecks
}

verifySetup().then((success) => {
  console.log('\n=== Verification Complete ===')
  process.exit(success ? 0 : 1)
}).catch(error => {
  console.error('Verification failed:', error)
  process.exit(1)
})