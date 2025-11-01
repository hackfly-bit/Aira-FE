// Dashboard Feature Exports
// This file serves as the main entry point for the Dashboard feature

// Components
export { DashboardStats } from './components/DashboardStats'
export * from './components'

// Hooks
export { useDashboardStats, useDashboardCharts, useDashboardActivities } from './hooks/useDashboardStats'
export * from './hooks'

// Services
export { dashboardService } from './services'
export * from './services'

// Types
export type {
  DashboardStat,
  DashboardChart,
  DashboardActivity,
  DashboardStatsProps,
  DashboardChartsProps,
  DashboardActivitiesProps,
  UseDashboardStatsOptions,
  UseDashboardChartsOptions,
  UseDashboardActivitiesOptions
} from './types'
export * from './types'
