import { UseQueryOptions } from '@tanstack/react-query'

// Dashboard Statistics
export interface DashboardStat {
  id: string
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: 'users' | 'roles' | 'permissions' | 'menus'
  description?: string
}

// Dashboard Charts
export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface DashboardChart {
  id: string
  title: string
  type: 'line' | 'bar' | 'pie' | 'area'
  data: ChartData[]
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  description?: string
}

// Dashboard Activities
export interface DashboardActivity {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  action: string
  target: string
  timestamp: string
  type: 'create' | 'update' | 'delete' | 'login' | 'logout'
  metadata?: Record<string, any>
}

// API Responses
export interface DashboardStatsResponse {
  data: DashboardStat[]
  meta: {
    last_updated: string
    cache_duration: number
  }
}

export interface DashboardChartsResponse {
  data: DashboardChart[]
  meta: {
    last_updated: string
    period: string
  }
}

export interface DashboardActivitiesResponse {
  data: DashboardActivity[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

// Hook Options
export interface UseDashboardStatsOptions extends Omit<UseQueryOptions<DashboardStat[], Error>, 'queryKey' | 'queryFn'> {
  refetchInterval?: number
}

export interface UseDashboardChartsOptions extends Omit<UseQueryOptions<DashboardChart[], Error>, 'queryKey' | 'queryFn'> {
  refetchInterval?: number
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export interface UseDashboardActivitiesOptions extends Omit<UseQueryOptions<DashboardActivity[], Error>, 'queryKey' | 'queryFn'> {
  refetchInterval?: number
  limit?: number
}

// Component Props
export interface DashboardStatsProps {
  className?: string
}

export interface DashboardChartsProps {
  className?: string
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export interface DashboardActivitiesProps {
  className?: string
  limit?: number
  showAvatar?: boolean
}

export interface DashboardOverviewProps {
  className?: string
}

// Dashboard Filters
export interface DashboardFilters {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  dateRange?: {
    from: Date
    to: Date
  }
  departments?: string[]
  users?: string[]
}

// Dashboard Configuration
export interface DashboardConfig {
  refreshInterval: number
  autoRefresh: boolean
  defaultPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly'
  chartsEnabled: boolean
  activitiesEnabled: boolean
  statsEnabled: boolean
}