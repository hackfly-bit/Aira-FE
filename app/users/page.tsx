'use client';

import { Suspense } from 'react';
import UsersList from '@/features/users/components/UsersList';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola data pengguna dan hak akses sistem</p>
        </div>
      </div>

      <Card className="p-6">
        <Suspense fallback={<LoadingSpinner />}>
          <UsersList />
        </Suspense>
      </Card>
    </div>
  );
}