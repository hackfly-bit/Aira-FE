'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Dashboard } from '@/components/dashboard/Dashboard';

type AuthView = 'login' | 'forgot-password';

export default function Home() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const { user } = useAuth();

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard />;
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
