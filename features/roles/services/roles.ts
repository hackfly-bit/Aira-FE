import { api } from '@/lib/api';
import type {
  Role,
  Permission,
  CreateRoleData,
  UpdateRoleData,
  RoleResponse,
  RolesListResponse,
  PermissionsListResponse,
} from '../types/role';

// API endpoints
const ROLES_ENDPOINT = '/roles';
const PERMISSIONS_ENDPOINT = '/permissions';

export const rolesApi = {
  // Get all roles
  getRoles: async (): Promise<RolesListResponse> => {
    const response = await api.get(ROLES_ENDPOINT);
    return response.data;
  },

  // Get single role by ID
  getRole: async (id: string): Promise<RoleResponse> => {
    const response = await api.get(`${ROLES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (data: CreateRoleData): Promise<RoleResponse> => {
    const response = await api.post(ROLES_ENDPOINT, data);
    return response.data;
  },

  // Update existing role
  updateRole: async (id: string, data: UpdateRoleData): Promise<RoleResponse> => {
    const response = await api.put(`${ROLES_ENDPOINT}/${id}`, data);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`${ROLES_ENDPOINT}/${id}`);
    return response.data;
  },

  // Get all permissions
  getPermissions: async (): Promise<PermissionsListResponse> => {
    const response = await api.get(PERMISSIONS_ENDPOINT);
    return response.data;
  },

  // Get permissions for a specific role
  getRolePermissions: async (roleId: string): Promise<PermissionsListResponse> => {
    const response = await api.get(`${ROLES_ENDPOINT}/${roleId}/permissions`);
    return response.data;
  },

  // Assign permission to role
  assignPermission: async (
    roleId: string,
    permissionId: string
  ): Promise<{ status: string; message: string }> => {
    const response = await api.post(`${ROLES_ENDPOINT}/${roleId}/permissions`, {
      permission_id: permissionId,
    });
    return response.data;
  },

  // Remove permission from role
  removePermission: async (
    roleId: string,
    permissionId: string
  ): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`${ROLES_ENDPOINT}/${roleId}/permissions/${permissionId}`);
    return response.data;
  },

  // Sync permissions for role (replace all permissions)
  syncPermissions: async (
    roleId: string,
    permissionIds: string[]
  ): Promise<{ status: string; message: string }> => {
    const response = await api.put(`${ROLES_ENDPOINT}/${roleId}/permissions`, {
      permission_ids: permissionIds,
    });
    return response.data;
  },
};

export const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getRolePermissions,
  assignPermission,
  removePermission,
  syncPermissions,
} = rolesApi;