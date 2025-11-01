'use client';

/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PermissionTable } from './PermissionTable';
import { PermissionForm } from './PermissionForm';
import { permissionsApi } from '@/features/permissions/services/permissions';
import type { Permission, PermissionListParams } from '@/features/permissions/types/permission';
import type { PermissionFormData } from '@/features/permissions/validations/permission';

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuard, setSelectedGuard] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPermissions, setTotalPermissions] = useState(0);

  // Fetch permissions
  const fetchPermissions = async (params?: PermissionListParams) => {
    try {
      setIsLoading(true);
      const response = await permissionsApi.getPermissions(params);
      setPermissions(response.data);
      setTotalPermissions(response.total || response.data.length);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPermissions();
  }, []);

  // Search and filter effect
  useEffect(() => {
    const params: PermissionListParams = {};
    
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    
    if (selectedGuard !== 'all') {
      params.guard_name = selectedGuard;
    }

    const timeoutId = setTimeout(() => {
      fetchPermissions(params);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGuard]);

  // Handle create permission
  const handleCreatePermission = async (data: PermissionFormData) => {
    try {
      setIsSubmitting(true);
      const response = await permissionsApi.createPermission(data);
      setPermissions(prev => [response.data, ...prev]);
      setTotalPermissions(prev => prev + 1);
      setIsCreateDialogOpen(false);
      toast.success('Permission created successfully');
    } catch (error: any) {
      console.error('Error creating permission:', error);
      const message = error.response?.data?.message || 'Failed to create permission';
      toast.error(message);
      throw error; // Re-throw to prevent form reset
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit permission
  const handleEditPermission = async (data: PermissionFormData) => {
    if (!selectedPermission) return;

    try {
      setIsSubmitting(true);
      const response = await permissionsApi.updatePermission(selectedPermission.id, data);
      setPermissions(prev =>
        prev.map(permission =>
          permission.id === selectedPermission.id ? response.data : permission
        )
      );
      setIsEditDialogOpen(false);
      setSelectedPermission(null);
      toast.success('Permission updated successfully');
    } catch (error: any) {
      console.error('Error updating permission:', error);
      const message = error.response?.data?.message || 'Failed to update permission';
      toast.error(message);
      throw error; // Re-throw to prevent form reset
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete permission
  const handleDeletePermission = async () => {
    if (!selectedPermission) return;

    try {
      setIsSubmitting(true);
      await permissionsApi.deletePermission(selectedPermission.id);
      setPermissions(prev => prev.filter(permission => permission.id !== selectedPermission.id));
      setTotalPermissions(prev => prev - 1);
      setIsDeleteDialogOpen(false);
      setSelectedPermission(null);
      toast.success('Permission deleted successfully');
    } catch (error: any) {
      console.error('Error deleting permission:', error);
      const message = error.response?.data?.message || 'Failed to delete permission';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle table actions
  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  const handleManageRoles = (permission: Permission) => {
    // TODO: Implement role management for permission
    toast.info('Role management feature coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground">
            Manage system permissions and access controls.
            {totalPermissions > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalPermissions} permission{totalPermissions !== 1 ? 's' : ''}
              </Badge>
            )}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Permission
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGuard} onValueChange={setSelectedGuard}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Guards" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guards</SelectItem>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <PermissionTable
        permissions={permissions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageRoles={handleManageRoles}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
            <DialogDescription>
              Add a new permission to the system. Permissions control what actions users can perform.
            </DialogDescription>
          </DialogHeader>
          <PermissionForm
            onSubmit={handleCreatePermission}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update the permission details. Note that the permission name cannot be changed.
            </DialogDescription>
          </DialogHeader>
          {selectedPermission && (
            <PermissionForm
              permission={selectedPermission}
              onSubmit={handleEditPermission}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedPermission(null);
              }}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the permission
              <strong className="mx-1">"{selectedPermission?.name}"</strong>
              and remove it from all roles that have it assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedPermission(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePermission}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                'Delete Permission'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}