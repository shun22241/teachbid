'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { GraduationCap, BookOpen, Users } from 'lucide-react'

interface RoleSelectorProps {
  value?: 'student' | 'teacher'
  onChange: (role: 'student' | 'teacher') => void
  className?: string
}

const roles = [
  {
    id: 'student' as const,
    title: '生徒として学ぶ',
    description: 'スキルアップや資格取得のために、専門知識を持つ講師から学びたい',
    icon: BookOpen,
    features: [
      '学習リクエストを投稿',
      '講師からの提案を比較検討',
      '安心の決済システム',
      '学習進捗の管理'
    ],
    color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
    selectedColor: 'bg-blue-100 border-blue-500'
  },
  {
    id: 'teacher' as const,
    title: '講師として教える',
    description: '専門スキルや知識を活かして、学習者をサポートし収入を得たい',
    icon: GraduationCap,
    features: [
      '学習リクエストに提案',
      '柔軟なスケジュール設定',
      '競争力のある手数料',
      '評価・レビューシステム'
    ],
    color: 'bg-green-50 border-green-200 hover:border-green-300',
    selectedColor: 'bg-green-100 border-green-500'
  }
]

export function RoleSelector({ value, onChange, className }: RoleSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center space-y-2">
        <Users className="w-12 h-12 mx-auto text-gray-400" />
        <h2 className="text-xl font-semibold">どちらの立場でご利用ですか？</h2>
        <p className="text-sm text-muted-foreground">
          あなたの目的に合った機能を提供します
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon
          const isSelected = value === role.id
          
          return (
            <Card
              key={role.id}
              className={cn(
                'cursor-pointer transition-all duration-200 border-2',
                isSelected ? role.selectedColor : role.color
              )}
              onClick={() => onChange(role.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isSelected ? 'bg-white' : 'bg-white/70'
                    )}>
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {role.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      主な機能
                    </div>
                    <div className="space-y-1">
                      {role.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex justify-center">
                      <Badge variant="default" className="text-xs">
                        選択中
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          後からプロフィール設定で変更することも可能です
        </p>
      </div>
    </div>
  )
}