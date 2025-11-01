// Menu Types
export interface Menu {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  url: string;
  icon?: string;
  parent_id?: number | null;
  sort_order: number;
  is_active: boolean;
  target: '_self' | '_blank' | '_parent' | '_top';
  permission?: string;
  created_at: string;
  updated_at: string;
  children?: Menu[];
  parent?: Menu;
}

// Create Menu Data
export interface CreateMenuData {
  name: string;
  display_name: string;
  description?: string;
  url: string;
  icon?: string;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
  permission?: string;
}

// Update Menu Data
export interface UpdateMenuData {
  name?: string;
  display_name?: string;
  description?: string;
  url?: string;
  icon?: string;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
  permission?: string;
}

// API Response Types
export interface MenuResponse {
  data: Menu;
  message: string;
}

export interface MenusListResponse {
  data: Menu[];
  message: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Table and Form Types
export interface MenuTableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

// Form Data
export interface MenuFormData {
  name: string;
  display_name: string;
  description: string;
  url: string;
  icon: string;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  target: '_self' | '_blank' | '_parent' | '_top';
  permission: string;
}

// Tree Structure
export interface MenuTreeItem {
  id: number;
  name: string;
  display_name: string;
  url: string;
  icon?: string;
  children?: MenuTreeItem[];
  level: number;
}

// Filter and Pagination
export interface MenuFilters {
  search?: string;
  parent_id?: number | null;
  is_active?: boolean;
  permission?: string;
}

export interface MenuListParams {
  page?: number;
  per_page?: number;
  search?: string;
  parent_id?: number | null;
  is_active?: boolean;
  permission?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Bulk Operations
export interface MenuReorderData {
  id: number;
  sort_order: number;
  parent_id?: number | null;
}

export interface MenuBulkDeleteData {
  ids: number[];
}

export interface MenuBulkUpdateData {
  ids: number[];
  data: Partial<UpdateMenuData>;
}

// Statistics
export interface MenuStats {
  total: number;
  active: number;
  inactive: number;
  root_menus: number;
  child_menus: number;
  max_depth: number;
}

// Icon Options
export interface MenuIconOption {
  value: string;
  label: string;
  icon: string;
}

// Constants
export const MENU_TARGETS = [
  { value: '_self', label: 'Same Window' },
  { value: '_blank', label: 'New Window' },
  { value: '_parent', label: 'Parent Frame' },
  { value: '_top', label: 'Top Frame' }
] as const;

export const MENU_STATUS_OPTIONS = [
  { value: true, label: 'Active', color: 'green' },
  { value: false, label: 'Inactive', color: 'red' }
] as const;

export const MENU_ICON_OPTIONS = [
  { value: 'Home', label: 'Home' },
  { value: 'User', label: 'User' },
  { value: 'Users', label: 'Users' },
  { value: 'Settings', label: 'Settings' },
  { value: 'BarChart3', label: 'Reports' },
  { value: 'FileText', label: 'Documents' },
  { value: 'Mail', label: 'Mail' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'Clock', label: 'Clock' },
  { value: 'Bell', label: 'Notifications' },
  { value: 'Shield', label: 'Security' },
  { value: 'Key', label: 'Permissions' },
  { value: 'Database', label: 'Database' },
  { value: 'Server', label: 'Server' },
  { value: 'Globe', label: 'Website' },
  { value: 'Link', label: 'Links' },
  { value: 'Image', label: 'Images' },
  { value: 'Video', label: 'Videos' },
  { value: 'Music', label: 'Music' },
  { value: 'Download', label: 'Downloads' },
  { value: 'Upload', label: 'Uploads' },
  { value: 'Search', label: 'Search' },
  { value: 'Filter', label: 'Filter' },
  { value: 'Tag', label: 'Tags' },
  { value: 'Bookmark', label: 'Bookmarks' },
  { value: 'Star', label: 'Favorites' },
  { value: 'Heart', label: 'Likes' },
  { value: 'MessageCircle', label: 'Messages' },
  { value: 'Phone', label: 'Phone' },
  { value: 'MapPin', label: 'Location' },
  { value: 'ShoppingCart', label: 'Shopping' },
  { value: 'CreditCard', label: 'Payments' },
  { value: 'DollarSign', label: 'Finance' },
  { value: 'TrendingUp', label: 'Analytics' },
  { value: 'PieChart', label: 'Charts' },
  { value: 'Activity', label: 'Activity' },
  { value: 'Zap', label: 'Performance' },
  { value: 'Tool', label: 'Tools' },
  { value: 'Wrench', label: 'Maintenance' },
  { value: 'Bug', label: 'Debug' },
  { value: 'Code', label: 'Code' },
  { value: 'Terminal', label: 'Terminal' },
  { value: 'Package', label: 'Packages' },
  { value: 'Layers', label: 'Layers' },
  { value: 'Grid', label: 'Grid' },
  { value: 'List', label: 'List' },
  { value: 'Table', label: 'Table' },
  { value: 'Layout', label: 'Layout' },
  { value: 'Sidebar', label: 'Sidebar' },
  { value: 'Menu', label: 'Menu' },
  { value: 'MoreHorizontal', label: 'More' },
  { value: 'Plus', label: 'Add' },
  { value: 'Minus', label: 'Remove' },
  { value: 'X', label: 'Close' },
  { value: 'Check', label: 'Check' },
  { value: 'AlertCircle', label: 'Alert' },
  { value: 'Info', label: 'Info' },
  { value: 'HelpCircle', label: 'Help' },
  { value: 'ExternalLink', label: 'External Link' }
] as const;