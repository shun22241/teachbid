const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createDemoUsers() {
  try {
    console.log('Creating demo users...')

    // Create student account
    console.log('Creating student account...')
    const { data: student, error: studentError } = await supabase.auth.admin.createUser({
      email: 'student1@test.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: { 
        role: 'student',
        display_name: 'デモ生徒'
      }
    })

    if (studentError) {
      console.error('Student creation error:', studentError)
    } else {
      console.log('Student created successfully:', student.user?.email)
      
      // Create profile for student
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: student.user.id,
          email: student.user.email,
          role: 'student',
          display_name: 'デモ生徒',
          bio: 'デモ用の生徒アカウントです',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.error('Student profile creation error:', profileError)
      } else {
        console.log('Student profile created successfully')
      }
    }

    // Create teacher account
    console.log('Creating teacher account...')
    const { data: teacher, error: teacherError } = await supabase.auth.admin.createUser({
      email: 'teacher1@test.com',
      password: 'password123',
      email_confirm: true,
      user_metadata: { 
        role: 'teacher',
        display_name: 'デモ講師'
      }
    })

    if (teacherError) {
      console.error('Teacher creation error:', teacherError)
    } else {
      console.log('Teacher created successfully:', teacher.user?.email)
      
      // Create profile for teacher
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: teacher.user.id,
          email: teacher.user.email,
          role: 'teacher',
          display_name: 'デモ講師',
          bio: 'デモ用の講師アカウントです',
          skills: ['プログラミング', '数学'],
          hourly_rate_min: 2000,
          hourly_rate_max: 5000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.error('Teacher profile creation error:', profileError)
      } else {
        console.log('Teacher profile created successfully')
      }
    }

    console.log('Demo users creation completed!')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the script
createDemoUsers().then(() => {
  console.log('Script finished')
  process.exit(0)
}).catch(error => {
  console.error('Script failed:', error)
  process.exit(1)
})