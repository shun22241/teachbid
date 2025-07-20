import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Pagination } from '@/components/ui/pagination'

interface Column<T> {
  key: keyof T | string
  title: string
  render?: (value: any, item: T) => ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyState?: {
    icon?: ReactNode
    title: string
    description?: string
    action?: ReactNode
  }
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyState,
  pagination,
  className
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full">
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    )
  }

  if (data.length === 0 && emptyState) {
    return (
      <EmptyState
        icon={emptyState.icon}
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
      />
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                    column.className
                  )}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {data.map((item, index) => (
              <tr 
                key={index} 
                className="hover:bg-muted/50 transition-colors"
              >
                {columns.map((column) => {
                  const value = column.key.includes('.') 
                    ? getNestedValue(item, column.key as string)
                    : item[column.key]
                  
                  return (
                    <td
                      key={column.key as string}
                      className={cn(
                        'px-6 py-4 whitespace-nowrap text-sm',
                        column.className
                      )}
                    >
                      {column.render ? column.render(value, item) : value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  )
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}