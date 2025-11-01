// Base User interface
export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  role: UserRole;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

// User Role interface
export interface UserRole {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  permissions: string[];
}

// API Response types
export interface UsersResponse {
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

// Request parameter types
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: User['status'];
  sort_by?: 'name' | 'email' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

// Form data types
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  role_id: string;
  status?: User['status'];
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  role_id?: string;
  status?: User['status'];
  avatar?: File;
}

// Hook options
export interface UseUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: User['status'];
  enabled?: boolean;
}

export interface UseUserOptions {
  id: string;
  enabled?: boolean;
}

// Component props
export interface UsersListProps {
  className?: string;
  onUserSelect?: (user: User) => void;
  selectedUsers?: string[];
  showActions?: boolean;
}

export interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onViewDetails?: (user: User) => void;
  showActions?: boolean;
  className?: string;
}

// Filter and search types
export interface UserFilters {
  search: string;
  role: string;
  status: User['status'] | '';
  dateRange?: {
    from: Date;
    to: Date;
  };
}

// Table column types
export interface UserTableColumn {
  key: keyof User | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (user: User) => React.ReactNode;
}

// Permission types
export interface UserPermission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  module: string;
}