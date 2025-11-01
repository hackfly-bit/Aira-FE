// User Management Types

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  roles: string[];
  permissions?: string[];
  status?: 'active' | 'inactive';
}

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

// User Form Data
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  status?: 'active' | 'inactive';
}

// Role Assignment
export interface AssignRoleData {
  role: string;
}

// API Response Types
export interface UserResponse {
  status: 'success' | 'error';
  data: User;
  message: string;
  code: number;
}

export interface UsersListResponse {
  status: 'success' | 'error';
  data: User[];
  message: string;
  code: number;
}

export interface RolesListResponse {
  status: 'success' | 'error';
  data: Role[];
  message: string;
  code: number;
}

// Table Types
export interface UserTableColumn {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive';
  created_at: string;
  actions?: React.ReactNode;
}

// Form Types
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
  status: 'active' | 'inactive';
}