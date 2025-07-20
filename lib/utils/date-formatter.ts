import { format, formatDistance, isToday, isYesterday, isTomorrow, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'

/**
 * Format date for display in Japanese locale
 */
export function formatDate(date: string | Date, formatString = 'yyyy年MM月dd日'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString, { locale: ja })
}

/**
 * Format time for display
 */
export function formatTime(date: string | Date, formatString = 'HH:mm'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString)
}

/**
 * Format date and time together
 */
export function formatDateTime(date: string | Date, formatString = 'yyyy年MM月dd日 HH:mm'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatString, { locale: ja })
}

/**
 * Format relative time (e.g., "2時間前", "3日前")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  
  if (isToday(dateObj)) {
    return '今日'
  }
  
  if (isYesterday(dateObj)) {
    return '昨日'
  }
  
  if (isTomorrow(dateObj)) {
    return '明日'
  }
  
  return formatDistance(dateObj, now, { locale: ja, addSuffix: true })
}

/**
 * Format date for form inputs (YYYY-MM-DD)
 */
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}

/**
 * Format date for API (ISO string)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString()
}

/**
 * Parse and validate date string
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = parseISO(dateString)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj < new Date()
}

/**
 * Check if date is in the future
 */
export function isDateInFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj > new Date()
}

/**
 * Get days between two dates
 */
export function getDaysBetween(startDate: string | Date, endDate: string | Date): number {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Format deadline with urgency indicator
 */
export function formatDeadline(deadline: string | Date): {
  formatted: string
  isUrgent: boolean
  daysLeft: number
} {
  const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline
  const now = new Date()
  const daysLeft = getDaysBetween(now, deadlineDate)
  const isUrgent = daysLeft <= 3 && deadlineDate > now
  
  let formatted: string
  if (deadlineDate < now) {
    formatted = '期限切れ'
  } else if (isToday(deadlineDate)) {
    formatted = '今日まで'
  } else if (isTomorrow(deadlineDate)) {
    formatted = '明日まで'
  } else if (daysLeft <= 7) {
    formatted = `${daysLeft}日後`
  } else {
    formatted = formatDate(deadlineDate, 'MM月dd日')
  }
  
  return {
    formatted,
    isUrgent,
    daysLeft,
  }
}

/**
 * Format business hours
 */
export function formatBusinessHours(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`
}

/**
 * Get current Japan time
 */
export function getCurrentJapanTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
}

/**
 * Format duration in weeks/days
 */
export function formatDuration(weeks?: number, days?: number): string {
  if (weeks && weeks > 0) {
    return `${weeks}週間`
  }
  if (days && days > 0) {
    return `${days}日間`
  }
  return '期間未設定'
}

/**
 * Format lesson schedule
 */
export function formatLessonSchedule(
  lessonsPerWeek?: number,
  lessonDuration?: number
): string {
  const parts: string[] = []
  
  if (lessonsPerWeek) {
    parts.push(`週${lessonsPerWeek}回`)
  }
  
  if (lessonDuration) {
    if (lessonDuration >= 60) {
      const hours = Math.floor(lessonDuration / 60)
      const minutes = lessonDuration % 60
      if (minutes > 0) {
        parts.push(`${hours}時間${minutes}分`)
      } else {
        parts.push(`${hours}時間`)
      }
    } else {
      parts.push(`${lessonDuration}分`)
    }
  }
  
  return parts.join(' ')
}

/**
 * Create date range for filtering
 */
export function createDateRange(days: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  
  return {
    start: formatDateForAPI(start),
    end: formatDateForAPI(end),
  }
}

/**
 * Format age from birthdate
 */
export function calculateAge(birthdate: string | Date): number {
  const birth = typeof birthdate === 'string' ? parseISO(birthdate) : birthdate
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}