 
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
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

import { RoleTable } from './RoleTable';
import { RoleForm } from './RoleForm';
import { rolesApi } from '@/features/roles/services/roles';
import type { Role } from '@/features/roles/types/role';
import type { RoleFormData } from '@/features/roles/validations/role';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load roles on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  // Filter roles based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRoles(roles);
    } else {
      const filtered = roles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    }
  }, [roles, searchTerm]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await rolesApi.getRoles();
      
      if (response.status === 'success') {
        setRoles(response.data);
      } else {
        toast.error('Failed to load roles: ' + response.message);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      toast.error('Failed to load roles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsFormDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsFormDialogOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleManagePermissions = (role: Role) => {
    // TODO: Implement permission management
    toast.info(`Permission management for "${role.display_name || role.name}" will be implemented soon.`);
  };

  const handleFormSubmit = async (data: RoleFormData) => {
    try {
      setFormLoading(true);

      let response;
      if (selectedRole) {
        // Update existing role
        response = await rolesApi.updateRole(selectedRole.id, data);
      } else {
        // Create new role
        response = await rolesApi.createRole(data);
      }

      if (response.status === 'success') {
        toast.success(
          selectedRole 
            ? `Role "${data.display_name}" updated successfully!`
            : `Role "${data.display_name}" created successfully!`
        );
        setIsFormDialogOpen(false);
        setSelectedRole(null);
        await loadRoles(); // Reload roles list
      } else {
        toast.error('Failed to save role: ' + response.message);
      }
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormDialogOpen(false);
    setSelectedRole(null);
  };

  const confirmDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      setDeleteLoading(true);
      const response = await rolesApi.deleteRole(selectedRole.id);

      if (response.status === 'success') {
        toast.success(`Role "${selectedRole.display_name || selectedRole.name}" deleted successfully!`);
        setIsDeleteDialogOpen(false);
        setSelectedRole(null);
        await loadRoles(); // Reload roles list
      } else {
        toast.error('Failed to delete role: ' + response.message);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteRole = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions for your application.
          </p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Roles Table */}
      <RoleTable
        roles={filteredRoles}
        loading={loading}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
        onManagePermissions={handleManagePermissions}
      />

      {/* Role Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
            <DialogDescription>
              {selectedRole 
                ? 'Update the role information below.'
                : 'Fill in the information below to create a new role.'
              }
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            role={selectedRole}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role{' '}
              <strong>&quot;{selectedRole?.display_name || selectedRole?.name}&quot;</strong>{' '}
              and remove it from all users who have this role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteRole} disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRole}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              ) : (
                'Delete Role'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}