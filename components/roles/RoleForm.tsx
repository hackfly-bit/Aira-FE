/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { roleFormSchema, type RoleFormData } from '@/lib/validations/role';
import type { Role } from '@/lib/types/role';

interface RoleFormProps {
  role?: Role | null;
  onSubmit: (data: RoleFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function RoleForm({ role, onSubmit, onCancel, loading = false }: RoleFormProps) {
  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      display_name: '',
      description: '',
    },
  });

  // Reset form when role changes
  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        display_name: role.display_name || '',
        description: role.description || '',
      });
    } else {
      form.reset({
        name: '',
        display_name: '',
        description: '',
      });
    }
  }, [role, form]);

  const handleSubmit = (data: RoleFormData) => {
    onSubmit(data);
  };

  const isEditing = !!role;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., admin, manager, user"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>
                  Unique identifier for the role. Use lowercase letters, numbers, underscores, and hyphens only.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Administrator, Manager, User"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>
                  Human-readable name for the role that will be displayed in the interface.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the role's purpose and responsibilities..."
                    className="min-h-[100px]"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>
                  Optional description explaining the role's purpose and responsibilities.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {isEditing ? 'Update Role' : 'Create Role'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}