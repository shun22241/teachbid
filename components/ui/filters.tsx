'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  children: ReactNode
  onReset?: () => void
  className?: string
}

export function FilterBar({ children, onReset, className }: FilterBarProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルター
          </div>
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-1" />
              リセット
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

interface SearchFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchFilter({ 
  value, 
  onChange, 
  placeholder = "検索...",
  className 
}: SearchFilterProps) {
  return (
    <div className={cn('relative flex-1 min-w-[200px]', className)}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}

interface SelectFilterProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  className?: string
}

export function SelectFilter({ 
  value, 
  onChange, 
  options, 
  placeholder = "選択してください",
  className 
}: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-10 px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface DateFilterProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  className?: string
}

export function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className
}: DateFilterProps) {
  return (
    <div className={cn('flex gap-2 items-center', className)}>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="w-auto"
      />
      <span className="text-muted-foreground">〜</span>
      <Input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="w-auto"
      />
    </div>
  )
}