import { z } from 'zod';

// Base role fields
const baseRoleFields = {
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Name can only contain letters, numbers, underscores, and hyphens'),
  
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(255, 'Display name must not exceed 255 characters'),
  
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
};

// Create role schema
export const createRoleSchema = z.object({
  ...baseRoleFields,
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
});

// Update role schema
export const updateRoleSchema = z.object({
  name: baseRoleFields.name.optional(),
  display_name: baseRoleFields.display_name.optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
});

// Role form schema for general use
export const roleFormSchema = z.object({
  ...baseRoleFields,
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .default(''),
});

// Permission assignment schema
export const assignPermissionSchema = z.object({
  permission: z
    .string()
    .min(1, 'Permission is required'),
});

// Type exports
export type RoleFormData = z.infer<typeof roleFormSchema>;
export type CreateRoleData = z.infer<typeof createRoleSchema>;
export type UpdateRoleData = z.infer<typeof updateRoleSchema>;
export type AssignPermissionData = z.infer<typeof assignPermissionSchema>;