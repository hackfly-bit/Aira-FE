'use client';

import { Suspense } from 'react';
import { UsersList } from '@/features/users';
import { Card, LoadingSpinner, PageHeader } from '@/shared/components';

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Manajemen Pengguna"
        description="Kelola data pengguna dan hak akses sistem"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pengguna', current: true },
        ]}
      />

      <Card className="p-6">
        <Suspense fallback={<LoadingSpinner />}>
          <UsersList />
        </Suspense>
      </Card>
    </div>
  );
}