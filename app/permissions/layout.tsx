import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}