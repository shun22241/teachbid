'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  HelpCircle,
  PlusCircle,
  FileText,
  TrendingUp,
  Calendar,
  MessageSquare,
  DollarSign,
  Star,
  BarChart3
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isStudent, isTeacher, isAdmin } = useAuth()

  const studentNavigation = [
    {
      title: 'メニュー',
      items: [
        { name: 'ダッシュボード', href: '/dashboard/student/dashboard', icon: LayoutDashboard },
        { name: '新規リクエスト', href: '/dashboard/student/requests/new', icon: PlusCircle },
        { name: 'リクエスト管理', href: '/dashboard/student/requests', icon: BookOpen },
        { name: '取引履歴', href: '/dashboard/student/transactions', icon: DollarSign },
        { name: 'レビュー', href: '/dashboard/student/reviews', icon: Star },
      ]
    },
    {
      title: 'サポート',
      items: [
        { name: 'メッセージ', href: '/dashboard/student/messages', icon: MessageSquare },
        { name: '設定', href: '/settings/profile', icon: Settings },
        { name: 'ヘルプ', href: '/help', icon: HelpCircle },
      ]
    }
  ]

  const teacherNavigation = [
    {
      title: 'メニュー',
      items: [
        { name: 'ダッシュボード', href: '/dashboard/teacher/dashboard', icon: LayoutDashboard },
        { name: 'リクエスト一覧', href: '/dashboard/teacher/browse', icon: BookOpen },
        { name: '提案管理', href: '/dashboard/teacher/proposals', icon: FileText },
        { name: 'スケジュール', href: '/dashboard/teacher/schedule', icon: Calendar },
        { name: '収益管理', href: '/dashboard/teacher/earnings', icon: TrendingUp },
        { name: 'レビュー', href: '/dashboard/teacher/reviews', icon: Star },
      ]
    },
    {
      title: 'サポート',
      items: [
        { name: 'メッセージ', href: '/dashboard/teacher/messages', icon: MessageSquare },
        { name: '設定', href: '/settings/profile', icon: Settings },
        { name: 'ヘルプ', href: '/help/teacher', icon: HelpCircle },
      ]
    }
  ]

  const adminNavigation = [
    {
      title: '管理',
      items: [
        { name: 'ダッシュボード', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'ユーザー管理', href: '/admin/users', icon: Users },
        { name: 'リクエスト管理', href: '/admin/requests', icon: BookOpen },
        { name: '取引管理', href: '/admin/transactions', icon: DollarSign },
        { name: '分析', href: '/admin/analytics', icon: BarChart3 },
      ]
    }
  ]

  const navigation = isStudent 
    ? studentNavigation 
    : isTeacher 
    ? teacherNavigation
    : isAdmin
    ? adminNavigation
    : []

  return (
    <aside className={cn('w-64 bg-card border-r', className)}>
      <div className="h-full py-6 px-4">
        <div className="space-y-8">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                    >
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3',
                          isActive && 'bg-secondary font-medium'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}