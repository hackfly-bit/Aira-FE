import { api } from '@/lib/api';
import type {
  Permission,
  CreatePermissionData,
  UpdatePermissionData,
  PermissionResponse,
  PermissionsListResponse,
  PermissionAssignmentResponse,
  PermissionListParams,
} from '../types/permission';

// API Endpoints
const PERMISSIONS_ENDPOINT = '/permissions';

export const permissionsApi = {
  // Get all permissions with optional filters
  getPermissions: async (params?: PermissionListParams): Promise<PermissionsListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.guard_name) queryParams.append('guard_name', params.guard_name);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const url = queryParams.toString() 
      ? `${PERMISSIONS_ENDPOINT}?${queryParams.toString()}`
      : PERMISSIONS_ENDPOINT;

    const response = await api.get(url);
    return response.data;
  },

  // Get single permission by ID
  getPermission: async (id: string): Promise<PermissionResponse> => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new permission
  createPermission: async (data: CreatePermissionData): Promise<PermissionResponse> => {
    const response = await api.post(PERMISSIONS_ENDPOINT, data);
    return response.data;
  },

  // Update existing permission
  updatePermission: async (id: string, data: UpdatePermissionData): Promise<PermissionResponse> => {
    const response = await api.put(`${PERMISSIONS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  // Delete permission
  deletePermission: async (id: string): Promise<PermissionAssignmentResponse> => {
    const response = await api.delete(`${PERMISSIONS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get permissions by guard name
  getPermissionsByGuard: async (guardName: string): Promise<PermissionsListResponse> => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}?guard_name=${guardName}`);
    return response.data;
  },

  // Search permissions
  searchPermissions: async (query: string): Promise<PermissionsListResponse> => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Bulk delete permissions
  bulkDeletePermissions: async (ids: string[]): Promise<PermissionAssignmentResponse> => {
    const response = await api.post(`${PERMISSIONS_ENDPOINT}/bulk-delete`, {
      permission_ids: ids,
    });
    return response.data;
  },

  // Check if permission exists
  checkPermissionExists: async (name: string): Promise<{ exists: boolean }> => {
    try {
      const response = await api.get(`${PERMISSIONS_ENDPOINT}/check-exists?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      return { exists: false };
    }
  },

  // Get permission statistics
  getPermissionStats: async (): Promise<{
    total: number;
    by_guard: Record<string, number>;
    recent_count: number;
  }> => {
    const response = await api.get(`${PERMISSIONS_ENDPOINT}/stats`);
    return response.data;
  },
};

export default {
  permissions: permissionsApi,
};