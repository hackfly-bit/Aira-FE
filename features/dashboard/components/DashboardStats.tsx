'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { cn } from '@/lib/utils'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats'
import { DashboardStatsProps, DashboardStat } from '@/features/dashboard/types'
import { 
  Users, 
  UserCheck, 
  Shield, 
  Menu,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

const iconMap = {
  users: Users,
  roles: UserCheck,
  permissions: Shield,
  menus: Menu,
}

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
}

export function DashboardStats({ className }: DashboardStatsProps) {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
        <Card className="col-span-full">
          <CardContent className="p-6">
            <p className="text-destructive">Error loading dashboard stats</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat: DashboardStat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap]
        const TrendIcon = trendIconMap[stat.trend as keyof typeof trendIconMap]
        
        return (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {Icon && (
                <Icon className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {TrendIcon && (
                    <TrendIcon className={cn(
                      "h-3 w-3",
                      stat.trend === 'up' && "text-green-500",
                      stat.trend === 'down' && "text-red-500",
                      stat.trend === 'neutral' && "text-gray-500"
                    )} />
                  )}
                  <span className={cn(
                    stat.trend === 'up' && "text-green-500",
                    stat.trend === 'down' && "text-red-500",
                    stat.trend === 'neutral' && "text-gray-500"
                  )}>
                    {stat.change}
                  </span>
                  <span>from last month</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}