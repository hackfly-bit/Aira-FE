'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface UsersLayoutProps {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <DashboardLayout title="Manajemen Users">
      {children}
    </DashboardLayout>
  );
}