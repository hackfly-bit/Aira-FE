 
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/lib/hooks/use-toast';

import { User } from '@/lib/types/user';
import { usersApi } from '@/lib/api/users';
import UserTable from './UserTable';
import { UserForm } from './UserForm';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { toast } = useToast();

  // Load users
  const loadUsers = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await usersApi.getUsers();
      setUsers(response.data);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load users'
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    const matchesRole = roleFilter === 'all' || 
      user.roles?.some(role => role === roleFilter);

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Get unique roles for filter
  const availableRoles = Array.from(
    new Set(
      users.flatMap(user => user.roles || [])
    )
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleUserFormClose = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleUserFormSuccess = () => {
    loadUsers(true);
  };

  const handleRefresh = () => {
    loadUsers(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddUser}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            A list of all users in the system. You can add, edit, or delete users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full md:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Users Table */}
          <UserTable
            users={filteredUsers}
            loading={isLoading}
            onEdit={handleEditUser}
            onDelete={(user) => {
              // TODO: Implement delete functionality
              console.log('Delete user:', user);
            }}
            onAssignRole={(user) => {
              // TODO: Implement role assignment
              console.log('Assign role to user:', user);
            }}
            onToggleStatus={(user) => {
              // TODO: Implement status toggle
              console.log('Toggle status for user:', user);
            }}
          />

          {/* Results Summary */}
          {!isLoading && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
              {(searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
                <span className="ml-1">(filtered)</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <UserForm
        open={showUserForm}
        onOpenChange={handleUserFormClose}
        user={editingUser}
        onSuccess={handleUserFormSuccess}
      />
    </div>
  );
}