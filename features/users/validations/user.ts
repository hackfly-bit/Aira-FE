import { z } from 'zod';

// Base user fields without refinement
const baseUserFields = {
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must not exceed 255 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  role: z
    .string()
    .min(1, 'Role is required'),
  
  status: z
    .enum(['active', 'inactive'])
    .default('active'),
};

// Create user schema (password required)
export const createUserSchema = z.object({
  ...baseUserFields,
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  
  password_confirmation: z
    .string()
    .min(1, 'Password confirmation is required'),
}).refine((data) => {
  return data.password === data.password_confirmation;
}, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// Update user schema (password optional)
export const updateUserSchema = z.object({
  ...baseUserFields,
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'Password must be at least 8 characters',
    }),
  
  password_confirmation: z
    .string()
    .optional(),
}).refine((data) => {
  if (data.password && data.password_confirmation) {
    return data.password === data.password_confirmation;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

// User form schema (alias for update schema)
export const userFormSchema = updateUserSchema;

// Assign role schema
export const assignRoleSchema = z.object({
  role: z
    .string()
    .min(1, 'Role is required'),
});

// Type exports
export type UserFormData = z.infer<typeof userFormSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type AssignRoleData = z.infer<typeof assignRoleSchema>;