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

// Table Column Type
export interface MenuTableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

// Form Data Type
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

// Menu Tree Structure
export interface MenuTreeItem {
  id: number;
  name: string;
  display_name: string;
  url: string;
  icon?: string;
  children?: MenuTreeItem[];
  level: number;
}

// Menu Filters
export interface MenuFilters {
  search?: string;
  parent_id?: number | null;
  is_active?: boolean;
  permission?: string;
}

// Menu List Parameters
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

// Menu Reorder Data
export interface MenuReorderData {
  id: number;
  sort_order: number;
  parent_id?: number | null;
}

// Menu Bulk Operations
export interface MenuBulkDeleteData {
  ids: number[];
}

export interface MenuBulkUpdateData {
  ids: number[];
  data: Partial<UpdateMenuData>;
}

// Menu Statistics
export interface MenuStats {
  total_menus: number;
  active_menus: number;
  inactive_menus: number;
  parent_menus: number;
  child_menus: number;
}

// Menu Icon Options
export interface MenuIconOption {
  value: string;
  label: string;
  icon: string;
}

// Menu Target Options
export const MENU_TARGETS = [
  { value: '_self', label: 'Same Window' },
  { value: '_blank', label: 'New Window' },
  { value: '_parent', label: 'Parent Frame' },
  { value: '_top', label: 'Top Frame' }
] as const;

// Menu Status Options
export const MENU_STATUS_OPTIONS = [
  { value: true, label: 'Active', color: 'green' },
  { value: false, label: 'Inactive', color: 'red' }
] as const;