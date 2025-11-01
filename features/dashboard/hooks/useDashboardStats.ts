'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/features/dashboard/services'
import { DashboardStat, UseDashboardStatsOptions } from '@/features/dashboard/types'

export function useDashboardStats(options: UseDashboardStatsOptions = {}) {
  const {
    refetchInterval = 5 * 60 * 1000, // 5 minutes
    enabled = true,
    ...queryOptions
  } = options

  return useQuery<DashboardStat[], Error>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    refetchInterval,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...queryOptions,
  })
}

export function useDashboardCharts(options: UseDashboardStatsOptions = {}) {
  const {
    refetchInterval = 10 * 60 * 1000, // 10 minutes
    enabled = true,
    ...queryOptions
  } = options

  return useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: () => dashboardService.getCharts(),
    refetchInterval,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...queryOptions,
  })
}

export function useDashboardActivities(options: UseDashboardStatsOptions = {}) {
  const {
    refetchInterval = 2 * 60 * 1000, // 2 minutes
    enabled = true,
    ...queryOptions
  } = options

  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: () => dashboardService.getRecentActivities(),
    refetchInterval,
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...queryOptions,
  })
}