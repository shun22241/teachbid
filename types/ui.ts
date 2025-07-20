import { ReactNode } from 'react'

// Base component props
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// Button variants and sizes
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

// Input types
export interface InputProps extends BaseComponentProps {
  type?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: boolean
  onChange?: (value: string) => void
}

// Select types
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  onChange?: (value: string | string[]) => void
}

// Modal/Dialog types
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Form types
export interface FormFieldProps extends BaseComponentProps {
  label?: string
  error?: string
  required?: boolean
  description?: string
}

// Toast/Notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Loading states
export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

// Empty state
export interface EmptyStateProps extends BaseComponentProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

// Pagination
export interface PaginationProps extends BaseComponentProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPrevNext?: boolean
  showFirstLast?: boolean
}

// Card components
export interface CardProps extends BaseComponentProps {
  title?: string
  description?: string
  footer?: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// Badge/Tag components
export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'error'

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
}

// Rating component
export interface RatingProps extends BaseComponentProps {
  value: number
  max?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: number) => void
}

// Avatar component
export interface AvatarProps extends BaseComponentProps {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallbackColor?: string
}

// Progress component
export interface ProgressProps extends BaseComponentProps {
  value: number
  max?: number
  showValue?: boolean
  color?: string
}

// Tabs component
export interface TabItem {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}

// Table component types
export interface TableColumn<T = any> {
  key: keyof T | string
  title: string
  render?: (value: any, record: T, index: number) => ReactNode
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyText?: string
  onRowClick?: (record: T, index: number) => void
  pagination?: PaginationProps
}

// Filter component types
export interface FilterOption {
  key: string
  label: string
  type: 'select' | 'range' | 'checkbox' | 'text'
  options?: SelectOption[]
  placeholder?: string
}

export interface FilterProps extends BaseComponentProps {
  filters: FilterOption[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  onReset: () => void
}

// Search component
export interface SearchProps extends BaseComponentProps {
  value?: string
  placeholder?: string
  loading?: boolean
  onSearch: (query: string) => void
  onClear?: () => void
}

// Dropdown menu types
export interface DropdownItem {
  key: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  onClick?: () => void
}

export interface DropdownProps extends BaseComponentProps {
  items: DropdownItem[]
  trigger: ReactNode
  placement?: 'bottom' | 'top' | 'left' | 'right'
}

// Sidebar/Navigation types
export interface NavigationItem {
  key: string
  label: string
  href?: string
  icon?: ReactNode
  active?: boolean
  children?: NavigationItem[]
  badge?: string | number
}

export interface SidebarProps extends BaseComponentProps {
  items: NavigationItem[]
  collapsed?: boolean
  onToggle?: () => void
}

// Header component
export interface HeaderProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

// Layout types
export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode
  sidebar?: ReactNode
  footer?: ReactNode
  maxWidth?: string
}

// Error boundary types
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: any) => void
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    error: string
    background: string
    surface: string
    text: string
  }
  fonts: {
    body: string
    heading: string
    mono: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
}

// Animation types
export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'spin'

export interface AnimationProps {
  type?: AnimationType
  duration?: number
  delay?: number
  repeat?: boolean
}