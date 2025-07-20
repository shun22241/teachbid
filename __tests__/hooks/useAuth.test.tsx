import { renderHook, act } from '@testing-library/react'
import { useAuth } from '@/hooks/useAuth'

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

// Mock Next.js navigation
const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mocks
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    })
  })

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
    expect(result.current.profile).toBe(null)
  })

  it('handles sign in', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    }

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn('test@example.com', 'password')
    })

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })
  })

  it('handles sign in error', async () => {
    const mockError = { message: 'Invalid credentials' }

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: mockError,
    })

    const { result } = renderHook(() => useAuth())

    let error
    await act(async () => {
      try {
        await result.current.signIn('test@example.com', 'wrongpassword')
      } catch (e) {
        error = e
      }
    })

    expect(error).toEqual(mockError)
  })

  it('handles sign up', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    }

    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signUp('test@example.com', 'password', 'student')
    })

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: {
        data: {
          role: 'student',
        },
      },
    })
  })

  it('handles sign out', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('determines user roles correctly', () => {
    const { result } = renderHook(() => useAuth())

    // Mock student profile
    act(() => {
      result.current.profile = { role: 'student' }
    })

    expect(result.current.isStudent).toBe(true)
    expect(result.current.isTeacher).toBe(false)
    expect(result.current.isAdmin).toBe(false)

    // Mock teacher profile
    act(() => {
      result.current.profile = { role: 'teacher' }
    })

    expect(result.current.isStudent).toBe(false)
    expect(result.current.isTeacher).toBe(true)
    expect(result.current.isAdmin).toBe(false)
  })
})