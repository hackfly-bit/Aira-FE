'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, FileText, Settings } from 'lucide-react';

type AuthView = 'login' | 'forgot-password';

export default function Home() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const { user } = useAuth();

  // If user is logged in, show dashboard
  if (user) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome to Aira Back Office Dashboard
            </h2>
            <p className="text-muted-foreground">
              Kelola sistem dan data Aira Wedding dengan mudah melalui dashboard ini.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  +7% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Akses cepat ke fitur-fitur utama sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Manage Users</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">View Reports</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Analytics</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  <Settings className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">Settings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Show authentication forms
  return (
    <>
      {authView === 'login' && (
        <LoginForm
          onForgotPassword={() => setAuthView('forgot-password')}
        />
      )}
      
      {authView === 'forgot-password' && (
        <ForgotPasswordForm
          onBackToLogin={() => setAuthView('login')}
        />
      )}
    </>
  );
}
