// Common API response structure
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// Paginated response structure
export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

// Common query parameters
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Form field types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

// Table column definition
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

// Filter types
export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

// Modal/Dialog props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

// Toast notification types
export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: number;
}

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
  current?: boolean;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

// Permission types
export interface Permission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  permissions: Permission[];
}

// Audit log types
export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// Error types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status_code: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Component base props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Data table props
export interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
  actions?: {
    onCreate?: () => void;
    onEdit?: (record: T) => void;
    onDelete?: (record: T) => void;
    onView?: (record: T) => void;
  };
  filters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

// Export all types
export type {
  ApiResponse,
  PaginatedResponse,
  BaseQueryParams,
  FormField,
  SelectOption,
  ValidationRule,
  TableColumn,
  FilterOption,
  DateRange,
  LoadingState,
  ModalProps,
  ToastNotification,
  ThemeMode,
  ThemeConfig,
  NavItem,
  Breadcrumb,
  FileUpload,
  Permission,
  Role,
  AuditLog,
  ApiError,
  ValidationError,
  BaseComponentProps,
  DataTableProps,
};