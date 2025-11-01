import { z } from 'zod';

// Base Permission validation schema
export const permissionSchema = z.object({
  name: z
    .string()
    .min(1, 'Permission name is required')
    .max(100, 'Permission name must be less than 100 characters')
    .regex(/^[a-z0-9._-]+$/, 'Permission name can only contain lowercase letters, numbers, dots, underscores, and hyphens'),
  display_name: z
    .string()
    .max(100, 'Display name must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  guard_name: z
    .string()
    .min(1, 'Guard name is required')
    .max(50, 'Guard name must be less than 50 characters'),
});

// Create Permission schema
export const createPermissionSchema = permissionSchema;

// Update Permission schema (all fields optional except validation rules)
export const updatePermissionSchema = permissionSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided for update',
  }
);

// Permission Form schema (for UI forms)
export const permissionFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Permission name is required')
    .max(100, 'Permission name must be less than 100 characters')
    .regex(/^[a-z0-9._-]+$/, 'Permission name can only contain lowercase letters, numbers, dots, underscores, and hyphens'),
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  guard_name: z
    .string()
    .min(1, 'Guard name is required')
    .max(50, 'Guard name must be less than 50 characters'),
});

// Permission assignment schema
export const assignPermissionSchema = z.object({
  permission_id: z.string().min(1, 'Permission ID is required'),
});

// Permission search/filter schema
export const permissionFiltersSchema = z.object({
  search: z.string().optional(),
  guard_name: z.string().optional(),
  sort_by: z.enum(['name', 'display_name', 'created_at']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
});

// Type exports for use in components
export type CreatePermissionData = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionData = z.infer<typeof updatePermissionSchema>;
export type PermissionFormData = z.infer<typeof permissionFormSchema>;
export type AssignPermissionData = z.infer<typeof assignPermissionSchema>;
export type PermissionFilters = z.infer<typeof permissionFiltersSchema>;