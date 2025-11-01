import { apiClient } from '@/shared/services'
import {
  DashboardStat,
  DashboardChart,
  DashboardActivity,
  DashboardStatsResponse,
  DashboardChartsResponse,
  DashboardActivitiesResponse,
  DashboardFilters
} from '@/features/dashboard/types'

class DashboardService {
  private readonly baseUrl = '/dashboard'

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStat[]> {
    const response = await apiClient.get<DashboardStatsResponse>(`${this.baseUrl}/stats`)
    return response.data.data
  }

  /**
   * Get dashboard charts data
   */
  async getCharts(period: string = 'monthly'): Promise<DashboardChart[]> {
    const response = await apiClient.get<DashboardChartsResponse>(`${this.baseUrl}/charts`, {
      params: { period }
    })
    return response.data.data
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 10): Promise<DashboardActivity[]> {
    const response = await apiClient.get<DashboardActivitiesResponse>(`${this.baseUrl}/activities`, {
      params: { limit }
    })
    return response.data.data
  }

  /**
   * Get filtered dashboard data
   */
  async getFilteredData(filters: DashboardFilters): Promise<{
    stats: DashboardStat[]
    charts: DashboardChart[]
    activities: DashboardActivity[]
  }> {
    const response = await apiClient.post(`${this.baseUrl}/filtered`, filters)
    return response.data.data
  }

  /**
   * Export dashboard data
   */
  async exportData(format: 'pdf' | 'excel' | 'csv', filters?: DashboardFilters): Promise<Blob> {
    const response = await apiClient.post(`${this.baseUrl}/export`, {
      format,
      filters
    }, {
      responseType: 'blob'
    })
    return response.data
  }

  /**
   * Get dashboard configuration
   */
  async getConfig(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/config`)
    return response.data.data
  }

  /**
   * Update dashboard configuration
   */
  async updateConfig(config: any): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/config`, config)
    return response.data.data
  }

  /**
   * Refresh dashboard cache
   */
  async refreshCache(): Promise<void> {
    await apiClient.post(`${this.baseUrl}/refresh-cache`)
  }
}

export const dashboardService = new DashboardService()