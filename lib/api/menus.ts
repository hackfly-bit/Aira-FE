import { apiClient } from '@/lib/api';
import type {
  Menu,
  CreateMenuData,
  UpdateMenuData,
  MenuResponse,
  MenusListResponse,
  MenuListParams,
  MenuFilters,
  MenuReorderData,
  MenuBulkDeleteData,
  MenuBulkUpdateData,
  MenuStats,
  MenuTreeItem
} from '@/lib/types/menu';

// Get all menus with optional filters and pagination
export async function getMenus(params?: MenuListParams): Promise<MenusListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.parent_id !== undefined) {
    searchParams.append('parent_id', params.parent_id?.toString() || '');
  }
  if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
  if (params?.permission) searchParams.append('permission', params.permission);
  if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params?.sort_order) searchParams.append('sort_order', params.sort_order);

  const url = `/menus${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return apiClient.get<MenusListResponse>(url);
}

// Get single menu by ID
export async function getMenu(id: number): Promise<MenuResponse> {
  return apiClient.get<MenuResponse>(`/menus/${id}`);
}

// Create new menu
export async function createMenu(data: CreateMenuData): Promise<MenuResponse> {
  return apiClient.post<MenuResponse>('/menus', data);
}

// Update existing menu
export async function updateMenu(id: number, data: UpdateMenuData): Promise<MenuResponse> {
  return apiClient.put<MenuResponse>(`/menus/${id}`, data);
}

// Delete menu
export async function deleteMenu(id: number): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/menus/${id}`);
}

// Get menu tree structure
export async function getMenuTree(params?: { is_active?: boolean }): Promise<{ data: MenuTreeItem[]; message: string }> {
  const searchParams = new URLSearchParams();
  if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
  
  const url = `/menus/tree${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return apiClient.get<{ data: MenuTreeItem[]; message: string }>(url);
}

// Get parent menus (menus without parent_id)
export async function getParentMenus(): Promise<MenusListResponse> {
  return apiClient.get<MenusListResponse>('/menus/parents');
}

// Get child menus by parent ID
export async function getChildMenus(parentId: number): Promise<MenusListResponse> {
  return apiClient.get<MenusListResponse>(`/menus/children/${parentId}`);
}

// Search menus by name or display name
export async function searchMenus(query: string, filters?: MenuFilters): Promise<MenusListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('search', query);
  
  if (filters?.parent_id !== undefined) {
    searchParams.append('parent_id', filters.parent_id?.toString() || '');
  }
  if (filters?.is_active !== undefined) searchParams.append('is_active', filters.is_active.toString());
  if (filters?.permission) searchParams.append('permission', filters.permission);

  return apiClient.get<MenusListResponse>(`/menus/search?${searchParams.toString()}`);
}

// Reorder menus
export async function reorderMenus(data: MenuReorderData[]): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/menus/reorder', { menus: data });
}

// Bulk delete menus
export async function bulkDeleteMenus(data: MenuBulkDeleteData): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/menus/bulk-delete', data);
}

// Bulk update menus
export async function bulkUpdateMenus(data: MenuBulkUpdateData): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>('/menus/bulk-update', data);
}

// Toggle menu status (active/inactive)
export async function toggleMenuStatus(id: number): Promise<MenuResponse> {
  return apiClient.post<MenuResponse>(`/menus/${id}/toggle-status`);
}

// Duplicate menu
export async function duplicateMenu(id: number, data?: { name?: string; display_name?: string }): Promise<MenuResponse> {
  return apiClient.post<MenuResponse>(`/menus/${id}/duplicate`, data);
}

// Check if menu name exists
export async function checkMenuExists(name: string, excludeId?: number): Promise<{ exists: boolean }> {
  const searchParams = new URLSearchParams();
  searchParams.append('name', name);
  if (excludeId) searchParams.append('exclude_id', excludeId.toString());
  
  return apiClient.get<{ exists: boolean }>(`/menus/check-exists?${searchParams.toString()}`);
}

// Get menu statistics
export async function getMenuStats(): Promise<{ data: MenuStats; message: string }> {
  return apiClient.get<{ data: MenuStats; message: string }>('/menus/stats');
}

// Get menu by URL
export async function getMenuByUrl(url: string): Promise<MenuResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append('url', url);
  
  return apiClient.get<MenuResponse>(`/menus/by-url?${searchParams.toString()}`);
}

// Get menus by permission
export async function getMenusByPermission(permission: string): Promise<MenusListResponse> {
  return apiClient.get<MenusListResponse>(`/menus/by-permission/${permission}`);
}

// Export menus
export async function exportMenus(format: 'json' | 'csv' = 'json'): Promise<Blob> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/export?format=${format}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': format === 'json' ? 'application/json' : 'text/csv',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to export menus');
  }

  return response.blob();
}

// Import menus
export async function importMenus(file: File): Promise<{ message: string; imported: number; errors?: string[] }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to import menus');
  }

  return response.json();
}

// Get menu breadcrumb
export async function getMenuBreadcrumb(id: number): Promise<{ data: Menu[]; message: string }> {
  return apiClient.get<{ data: Menu[]; message: string }>(`/menus/${id}/breadcrumb`);
}

// Move menu to different parent
export async function moveMenu(id: number, newParentId: number | null): Promise<MenuResponse> {
  return apiClient.post<MenuResponse>(`/menus/${id}/move`, { parent_id: newParentId });
}