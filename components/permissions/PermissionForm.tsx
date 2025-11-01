'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { permissionFormSchema, type PermissionFormData } from '@/lib/validations/permission';
import type { Permission } from '@/lib/types/permission';

interface PermissionFormProps {
  permission?: Permission;
  onSubmit: (data: PermissionFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const GUARD_OPTIONS = [
  { value: 'web', label: 'Web' },
  { value: 'api', label: 'API' },
  { value: 'admin', label: 'Admin' },
];

export function PermissionForm({
  permission,
  onSubmit,
  onCancel,
  isLoading = false,
}: PermissionFormProps) {
  const form = useForm<PermissionFormData>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: permission?.name || '',
      display_name: permission?.display_name || '',
      description: permission?.description || '',
      guard_name: permission?.guard_name || 'web',
    },
  });

  const handleSubmit = async (data: PermissionFormData) => {
    try {
      await onSubmit(data);
      if (!permission) {
        // Reset form only for create mode
        form.reset();
      }
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submission error:', error);
    }
  };

  const generateDisplayName = (name: string) => {
    // Convert permission name to display name
    // e.g., "users.create" -> "Create Users"
    return name
      .split('.')
      .reverse()
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    
    // Auto-generate display name if it's empty
    const currentDisplayName = form.getValues('display_name');
    if (!currentDisplayName && value) {
      form.setValue('display_name', generateDisplayName(value));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permission Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., users.create, posts.edit"
                  {...field}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={isLoading || !!permission} // Disable editing name for existing permissions
                />
              </FormControl>
              <FormDescription>
                Use lowercase letters, numbers, dots, underscores, and hyphens only.
                {permission && ' (Cannot be changed for existing permissions)'}
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
                  placeholder="e.g., Create Users, Edit Posts"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Human-readable name for this permission.
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
                  placeholder="Describe what this permission allows users to do..."
                  className="resize-none"
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Optional description to explain the purpose of this permission.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guard_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guard *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a guard" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GUARD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The guard determines where this permission can be used.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {permission ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              permission ? 'Update Permission' : 'Create Permission'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}