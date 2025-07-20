'use client'

import { CATEGORIES, getCategoryBySlug } from '@/lib/constants/categories'
import { cn } from '@/lib/utils'

interface CategoryIconProps {
  categorySlug: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
}

export function CategoryIcon({ 
  categorySlug, 
  size = 'md', 
  className,
  showText = false 
}: CategoryIconProps) {
  const category = getCategoryBySlug(categorySlug)
  
  if (!category) {
    return null
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-12 h-12 text-xl'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div 
        className={cn(
          'flex items-center justify-center rounded-lg font-medium',
          sizeClasses[size]
        )}
        style={{ backgroundColor: `${category.color}20` }}
      >
        <span role="img" aria-label={category.name}>
          {category.icon}
        </span>
      </div>
      {showText && (
        <span className={cn('font-medium', textSizes[size])}>
          {category.name}
        </span>
      )}
    </div>
  )
}

interface CategoryBadgeProps {
  categorySlug: string
  subcategory?: string
  className?: string
  variant?: 'default' | 'outline'
}

export function CategoryBadge({ 
  categorySlug, 
  subcategory,
  className,
  variant = 'default'
}: CategoryBadgeProps) {
  const category = getCategoryBySlug(categorySlug)
  
  if (!category) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div 
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
          variant === 'outline' 
            ? 'border' 
            : 'text-white'
        )}
        style={{
          backgroundColor: variant === 'outline' ? 'transparent' : category.color,
          borderColor: variant === 'outline' ? category.color : 'transparent',
          color: variant === 'outline' ? category.color : 'white'
        }}
      >
        <span role="img" aria-label={category.name}>
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      {subcategory && (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {subcategory}
        </div>
      )}
    </div>
  )
}

interface CategoryListProps {
  selectedCategory?: string
  onCategorySelect?: (categorySlug: string) => void
  className?: string
  layout?: 'grid' | 'list'
}

export function CategoryList({ 
  selectedCategory,
  onCategorySelect,
  className,
  layout = 'grid'
}: CategoryListProps) {
  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'
    : 'space-y-2'

  return (
    <div className={cn(gridClasses, className)}>
      {CATEGORIES.map((category) => (
        <button
          key={category.slug}
          onClick={() => onCategorySelect?.(category.slug)}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border transition-colors',
            'hover:bg-gray-50 hover:border-gray-300',
            selectedCategory === category.slug
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200',
            layout === 'grid' ? 'flex-col text-center' : 'flex-row'
          )}
        >
          <div 
            className="w-10 h-10 flex items-center justify-center rounded-lg text-lg"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <span role="img" aria-label={category.name}>
              {category.icon}
            </span>
          </div>
          <div className={cn(
            layout === 'grid' ? 'text-center' : 'text-left flex-1'
          )}>
            <div className="font-medium text-sm">{category.name}</div>
            {layout === 'list' && (
              <div className="text-xs text-muted-foreground line-clamp-2">
                {category.description}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}