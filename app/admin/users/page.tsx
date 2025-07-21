'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  User,
  Mail,
  Calendar,
  Shield
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  avatar_url: string | null
  bio: string | null
  stripe_account_enabled: boolean
  created_at: string
  last_sign_in_at: string | null
}

export default function AdminUsersPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Check admin access
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          toast({
            title: 'アクセス拒否',
            description: '管理者権限が必要です',
            variant: 'destructive'
          })
          router.push('/dashboard')
          return
        }

        // Fetch all users
        const { data: usersData, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setUsers(usersData || [])
        setFilteredUsers(usersData || [])

      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: 'エラー',
          description: 'ユーザー情報の取得に失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase, router, toast])

  useEffect(() => {
    let filtered = users

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, roleFilter])

  const handleUserAction = async (userId: string, action: string) => {
    try {
      switch (action) {
        case 'suspend':
          // In a real implementation, you'd update a suspended status
          toast({
            title: '機能準備中',
            description: 'ユーザー停止機能は準備中です',
          })
          break
        case 'activate':
          toast({
            title: '機能準備中',
            description: 'ユーザー有効化機能は準備中です',
          })
          break
        case 'delete':
          toast({
            title: '機能準備中',
            description: 'ユーザー削除機能は準備中です',
          })
          break
        default:
          break
      }
    } catch (error) {
      console.error('Error performing user action:', error)
      toast({
        title: 'エラー',
        description: '操作に失敗しました',
        variant: 'destructive'
      })
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">管理者</Badge>
      case 'teacher':
        return <Badge variant="default">講師</Badge>
      case 'student':
        return <Badge variant="secondary">学生</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ユーザー管理</h1>
        <p className="text-muted-foreground">
          プラットフォームの全ユーザーを管理します
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ユーザー名やメールアドレスで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ロール" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="student">学生</SelectItem>
                <SelectItem value="teacher">講師</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">学生</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'student').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">講師</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'teacher').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">今月の新規登録</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => {
                const createdDate = new Date(u.created_at)
                const now = new Date()
                return createdDate.getMonth() === now.getMonth() && 
                       createdDate.getFullYear() === now.getFullYear()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>ユーザー一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || roleFilter !== 'all' 
                  ? '条件に一致するユーザーが見つかりません' 
                  : 'ユーザーがいません'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {user.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.full_name}</h4>
                        {getRoleBadge(user.role)}
                        {user.role === 'teacher' && user.stripe_account_enabled && (
                          <Badge variant="outline" className="text-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            決済有効
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          登録: {new Date(user.created_at).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => navigator.clipboard.writeText(user.id)}
                      >
                        ユーザーIDをコピー
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigator.clipboard.writeText(user.email)}
                      >
                        メールアドレスをコピー
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        className="text-orange-600"
                      >
                        アカウント停止
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-600"
                      >
                        アカウント削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}