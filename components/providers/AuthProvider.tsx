'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '@/lib/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aira-wedding-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('aira-wedding-user');
      }
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication - in real app, this would be an API call
      if (email === 'admin@airawedding.com' && password === 'password123') {
        const userData: User = {
          id: '1',
          name: 'Admin Aira Wedding',
          email: email,
          roles: ['admin'],
          permissions: ['create-posts', 'edit-posts', 'delete-posts'],
        };

        setUser(userData);

        // Save to localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('aira-wedding-user', JSON.stringify(userData));
        }

        return { success: true, user: userData };
      } else {
        throw new Error('Email atau password tidak valid');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('aira-wedding-user');
  };

  const forgotPassword = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _email: string
  ) => {
    // Note: _email parameter is intentionally unused in mock implementation
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success response
      return { success: true, message: 'Link reset password telah dikirim ke email Anda' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}