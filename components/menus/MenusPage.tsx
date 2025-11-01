'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, Upload, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Badge } from '@/components/ui/badge';
import { MenuTable } from './MenuTable';
import { MenuForm } from './MenuForm';
import { menusApi } from '@/features/menus/services/menus';
import { permissionsApi } from '@/features/permissions/services/permissions';
import type { Menu, MenuListParams } from '@/features/menus/types/menu';
import type { MenuFormData } from '@/features/menus/validations/menu';
import type { Permission } from '@/features/permissions/types/permission';

export function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [parentMenus, setParentMenus] = useState<Menu[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [stats, setStats] = useState<MenuStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [parentFilter, setParentFilter] = useState<string>('all');
  
  // Fetch data functions
  const fetchMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.is_active = statusFilter === 'active';
      if (parentFilter !== 'all') {
        if (parentFilter === 'root') {
          params.parent_id = null;
        } else {
          params.parent_id = parseInt(parentFilter);
        }
      }
      
      const response = await getMenus(params);
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast.error('Failed to fetch menus');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, parentFilter]);

  const fetchParentMenus = useCallback(async () => {
    try {
      const response = await getParentMenus();
      setParentMenus(response.data);
    } catch (error) {
      console.error('Error fetching parent menus:', error);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await permissionsApi.getPermissions();
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getMenuStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching menu stats:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMenus();
    fetchParentMenus();
    fetchPermissions();
    fetchStats();
  }, [fetchMenus, fetchParentMenus, fetchPermissions, fetchStats]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenus();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, parentFilter, fetchMenus]);

  // Event handlers
  const handleCreateMenu = () => {
    setSelectedMenu(null);
    setIsFormDialogOpen(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsFormDialogOpen(true);
  };

  const handleDeleteMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsDeleteDialogOpen(true);
  };

  const handleDuplicateMenu = async (menu: Menu) => {
    try {
      setIsSubmitting(true);
      await duplicateMenu(menu.id);
      toast.success('Menu duplicated successfully');
      fetchMenus();
      fetchStats();
    } catch (error) {
      console.error('Error duplicating menu:', error);
      toast.error('Failed to duplicate menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveMenu = (menu: Menu) => {
    // For now, just show a toast. In a real app, you'd implement a move dialog
    toast.info('Move functionality would be implemented here');
  };

  const handleToggleStatus = async (menu: Menu) => {
    try {
      await toggleMenuStatus(menu.id);
      toast.success(`Menu ${menu.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchMenus();
      fetchStats();
    } catch (error) {
      console.error('Error toggling menu status:', error);
      toast.error('Failed to update menu status');
    }
  };

  const handleViewChildren = (menu: Menu) => {
    // Filter to show only children of this menu
    setParentFilter(menu.id.toString());
    toast.info(`Showing children of "${menu.display_name}"`);
  };

  const handleFormSubmit = async (data: MenuFormData) => {
    try {
      setIsSubmitting(true);
      
      // Ensure description is not undefined and convert to proper types
      const menuData = {
        ...data,
        description: data.description || '',
        icon: data.icon || '',
        permission: data.permission || '',
        parent_id: data.parent_id || null
      };
      
      if (selectedMenu) {
        await updateMenu(selectedMenu.id, menuData as UpdateMenuData);
        toast.success('Menu updated successfully');
      } else {
        await createMenu(menuData as CreateMenuData);
        toast.success('Menu created successfully');
      }
      
      setIsFormDialogOpen(false);
      setSelectedMenu(null);
      fetchMenus();
      fetchParentMenus();
      fetchStats();
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error(selectedMenu ? 'Failed to update menu' : 'Failed to create menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormDialogOpen(false);
    setSelectedMenu(null);
  };

  const confirmDelete = async () => {
    if (!selectedMenu) return;
    
    try {
      setIsSubmitting(true);
      await deleteMenu(selectedMenu.id);
      toast.success('Menu deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedMenu(null);
      fetchMenus();
      fetchParentMenus();
      fetchStats();
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Failed to delete menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchMenus();
    fetchParentMenus();
    fetchPermissions();
    fetchStats();
    toast.success('Data refreshed');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setParentFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menus</h1>
          <p className="text-muted-foreground">
            Manage navigation menus and menu structure
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleCreateMenu}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Menus</h3>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Active Menus</h3>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Root Menus</h3>
            </div>
            <div className="text-2xl font-bold">{stats.root_menus}</div>
          </div>
          <div className="bg-card text-card-foreground rounded-lg border p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Max Depth</h3>
            </div>
            <div className="text-2xl font-bold">{stats.max_depth}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search menus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={parentFilter} onValueChange={setParentFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Parents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parents</SelectItem>
            <SelectItem value="root">Root Menus</SelectItem>
            {parentMenus.map((parent) => (
              <SelectItem key={parent.id} value={parent.id.toString()}>
                {parent.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchQuery || statusFilter !== 'all' || parentFilter !== 'all') && (
          <Button variant="outline" onClick={handleClearFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <MenuTable
        menus={menus}
        isLoading={isLoading}
        onEdit={handleEditMenu}
        onDelete={handleDeleteMenu}
        onDuplicate={handleDuplicateMenu}
        onMove={handleMoveMenu}
        onToggleStatus={handleToggleStatus}
        onViewChildren={handleViewChildren}
      />

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMenu ? 'Edit Menu' : 'Create New Menu'}
            </DialogTitle>
            <DialogDescription>
              {selectedMenu 
                ? 'Update the menu information below.'
                : 'Fill in the information below to create a new menu.'
              }
            </DialogDescription>
          </DialogHeader>
          <MenuForm
            menu={selectedMenu ?? undefined}
            parentMenus={parentMenus}
            permissions={permissions.map(p => p.name)}
            isLoading={isSubmitting}
            onSubmit={(data) => handleFormSubmit(data as MenuFormData)}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu
              <strong> &ldquo;{selectedMenu?.display_name}&rdquo;</strong> and all its children.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}