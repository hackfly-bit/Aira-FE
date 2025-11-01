import { z } from 'zod';

// Base Menu Schema
export const menuSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  display_name: z.string().min(1, 'Display name is required').max(100, 'Display name must be less than 100 characters'),
  description: z.string().max(255, 'Description must be less than 255 characters').optional(),
  url: z.string().min(1, 'URL is required').max(255, 'URL must be less than 255 characters'),
  icon: z.string().max(50, 'Icon must be less than 50 characters').optional(),
  parent_id: z.number().int().positive().nullable().optional(),
  sort_order: z.number().int().min(0, 'Sort order must be non-negative'),
  is_active: z.boolean(),
  target: z.enum(['_self', '_blank', '_parent', '_top']),
  permission: z.string().max(100, 'Permission must be less than 100 characters').optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Create Menu Schema
export const createMenuSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-z0-9_-]+$/, 'Name must contain only lowercase letters, numbers, hyphens, and underscores'),
  display_name: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  description: z.string()
    .max(255, 'Description must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  url: z.string()
    .min(1, 'URL is required')
    .max(255, 'URL must be less than 255 characters')
    .regex(/^\//, 'URL must start with /'),
  icon: z.string()
    .max(50, 'Icon must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  parent_id: z.number()
    .int()
    .positive('Parent ID must be positive')
    .nullable()
    .optional(),
  sort_order: z.number()
    .int()
    .min(0, 'Sort order must be non-negative')
    .default(0),
  is_active: z.boolean().default(true),
  target: z.enum(['_self', '_blank', '_parent', '_top']).default('_self'),
  permission: z.string()
    .max(100, 'Permission must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

// Update Menu Schema
export const updateMenuSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-z0-9_-]+$/, 'Name must contain only lowercase letters, numbers, hyphens, and underscores')
    .optional(),
  display_name: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters')
    .optional(),
  description: z.string()
    .max(255, 'Description must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  url: z.string()
    .min(1, 'URL is required')
    .max(255, 'URL must be less than 255 characters')
    .regex(/^\//, 'URL must start with /')
    .optional(),
  icon: z.string()
    .max(50, 'Icon must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  parent_id: z.number()
    .int()
    .positive('Parent ID must be positive')
    .nullable()
    .optional(),
  sort_order: z.number()
    .int()
    .min(0, 'Sort order must be non-negative')
    .optional(),
  is_active: z.boolean().optional(),
  target: z.enum(['_self', '_blank', '_parent', '_top']).optional(),
  permission: z.string()
    .max(100, 'Permission must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

// Menu Form Schema (for react-hook-form)
export const menuFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-z0-9_-]+$/, 'Name must contain only lowercase letters, numbers, hyphens, and underscores'),
  display_name: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  description: z.string()
    .max(255, 'Description must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  url: z.string()
    .min(1, 'URL is required')
    .max(255, 'URL must be less than 255 characters')
    .regex(/^\//, 'URL must start with /'),
  icon: z.string()
    .max(50, 'Icon must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  parent_id: z.number()
    .int()
    .positive('Parent ID must be positive')
    .nullable()
    .optional(),
  sort_order: z.number()
    .int()
    .min(0, 'Sort order must be non-negative'),
  is_active: z.boolean(),
  target: z.enum(['_self', '_blank', '_parent', '_top']),
  permission: z.string()
    .max(100, 'Permission must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

// Menu Filters Schema
export const menuFiltersSchema = z.object({
  search: z.string().optional(),
  parent_id: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().optional(),
  permission: z.string().optional(),
});

// Menu List Parameters Schema
export const menuListParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  per_page: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  parent_id: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().optional(),
  permission: z.string().optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

// Menu Reorder Schema
export const menuReorderSchema = z.object({
  id: z.number().int().positive(),
  sort_order: z.number().int().min(0),
  parent_id: z.number().int().positive().nullable().optional(),
});

// Menu Bulk Delete Schema
export const menuBulkDeleteSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'At least one menu must be selected'),
});

// Menu Bulk Update Schema
export const menuBulkUpdateSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'At least one menu must be selected'),
  data: updateMenuSchema,
});

// Type exports
export type MenuFormData = z.infer<typeof menuFormSchema>;
export type CreateMenuData = z.infer<typeof createMenuSchema>;
export type UpdateMenuData = z.infer<typeof updateMenuSchema>;
export type MenuFilters = z.infer<typeof menuFiltersSchema>;
export type MenuListParams = z.infer<typeof menuListParamsSchema>;
export type MenuReorderData = z.infer<typeof menuReorderSchema>;
export type MenuBulkDeleteData = z.infer<typeof menuBulkDeleteSchema>;
export type MenuBulkUpdateData = z.infer<typeof menuBulkUpdateSchema>;