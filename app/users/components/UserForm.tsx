'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/lib/hooks/use-toast';

import { User, Role } from '@/features/users/types/user';
import { usersApi } from '@/features/users/services/users';
import { rolesApi } from '@/features/roles/services/roles';
import {
  createUserSchema,
  updateUserSchema,
  CreateUserData,
  UpdateUserData,
} from '@/features/users/validations/user';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess?: () => void;
}

export function UserForm({ open, onOpenChange, user, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { toast } = useToast();

  const isEdit = !!user;

  const form = useForm<any>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: '',
      status: 'active' as const,
    },
  });

  // Load roles on mount
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await rolesApi.getRoles();
        setRoles(response.data);
      } catch (error) {
        console.error('Failed to load roles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load roles',
          variant: 'destructive',
        });
      }
    };

    if (open) {
      loadRoles();
    }
  }, [open, toast]);

  // Reset form when user changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          password: '',
          password_confirmation: '',
          role: user.roles?.[0]?.name || '',
          status: user.status,
        });
      } else {
        form.reset({
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: '',
          status: 'active',
        });
      }
    }
  }, [open, user, form]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      if (isEdit && user) {
        // Remove empty password fields for update
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
          delete updateData.password_confirmation;
        }
        
        await usersApi.updateUser(user.id, updateData as UpdateUserData);
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        await usersApi.createUser(data as CreateUserData);
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      console.error('Failed to save user:', error);
      
      // Handle validation errors from API
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as any;
        if (apiError.response?.data?.errors) {
          const apiErrors = apiError.response.data.errors;
          Object.keys(apiErrors).forEach((field) => {
            form.setError(field as any, {
              type: 'manual',
              message: apiErrors[field][0],
            });
          });
        } else {
          toast({
            title: 'Error',
            description: apiError.response?.data?.message || 'Failed to save user',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save user',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update user information. Leave password fields empty to keep current password.'
              : 'Fill in the information to create a new user.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {isEdit && '(leave empty to keep current)'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isEdit ? 'Enter new password' : 'Enter password'}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password {isEdit && '(leave empty to keep current)'}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        placeholder="Confirm password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      >
                        {showPasswordConfirmation ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Update User' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}