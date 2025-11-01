'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUsers } from '@/features/users/hooks';
import type { User } from '@/features/users/types';

interface UsersListProps {
  className?: string;
}

export default function UsersList({ className }: UsersListProps) {
  const [page, setPage] = useState(1);
  const { data: users, isLoading, error } = useUsers({ page, limit: 10 });

  const handleEditUser = (user: User) => {
    // TODO: implement edit user logic
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (user: User) => {
    // TODO: implement delete user logic
    console.log('Delete user:', user);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (user: User) => (
        <div className="font-medium">{user.name}</div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (user: User) => (
        <div className="text-muted-foreground">{user.email}</div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: User) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {user.role?.display_name || 'No Role'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: User) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center text-red-600">
            Error loading users: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data?.map((user: User) => (
              <TableRow key={user.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render(user)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Simple pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {users?.meta?.last_page || 1}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPage(p => p + 1)}
            disabled={page >= (users?.meta?.last_page || 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}