// Role Management Types

export interface Role {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Role Form Data
export interface CreateRoleData {
  name: string;
  display_name?: string;
  description?: string;
}

export interface UpdateRoleData {
  name?: string;
  display_name?: string;
  description?: string;
}

// API Response Types
export interface RoleResponse {
  status: 'success' | 'error';
  data: Role;
  message: string;
  code: number;
}

export interface RolesListResponse {
  status: 'success' | 'error';
  data: Role[];
  message: string;
  code: number;
}

export interface PermissionsListResponse {
  status: 'success' | 'error';
  data: Permission[];
  message: string;
  code: number;
}

// Role Table Column Type
export interface RoleTableColumn {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  created_at: string;
  actions?: React.ReactNode;
}

// Role Form Schema
export interface RoleFormData {
  name: string;
  display_name: string;
  description: string;
}