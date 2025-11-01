// Permission Management Types

export interface Permission {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  guard_name?: string;
  created_at: string;
  updated_at: string;
}

// Permission Form Data
export interface CreatePermissionData {
  name: string;
  display_name?: string;
  description?: string;
  guard_name?: string;
}

export interface UpdatePermissionData {
  name?: string;
  display_name?: string;
  description?: string;
  guard_name?: string;
}

// API Response Types
export interface PermissionResponse {
  status: 'success' | 'error';
  data: Permission;
  message: string;
  code: number;
}

export interface PermissionsListResponse {
  status: 'success' | 'error';
  data: Permission[];
  total?: number;
  message: string;
  code: number;
}

// Table and Form Types
export interface PermissionTableColumn {
  id: string;
  name: string;
  display_name?: string;
  description?: string;
  guard_name?: string;
  created_at: string;
  actions?: React.ReactNode;
}

// PermissionFormData is now defined in validations/permission.ts

// Permission Assignment Types
export interface AssignPermissionData {
  permission_id: string;
}

export interface PermissionAssignmentResponse {
  status: 'success' | 'error';
  message: string;
  code: number;
}

// Permission Search and Filter Types
export interface PermissionFilters {
  search?: string;
  guard_name?: string;
  sort_by?: 'name' | 'display_name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface PermissionListParams extends PermissionFilters {
  page?: number;
  per_page?: number;
}