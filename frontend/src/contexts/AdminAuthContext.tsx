'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, adminRefreshToken, AdminLoginRequest, AdminLoginResponse } from '@/lib/admin';
import { api } from '@/lib/api';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: AdminLoginRequest) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'adminAccessToken';
const ADMIN_REFRESH_TOKEN_KEY = 'adminRefreshToken';
const ADMIN_USER_KEY = 'adminUser';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const savedAdmin = localStorage.getItem(ADMIN_USER_KEY);

      if (token && savedAdmin) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setAdmin(JSON.parse(savedAdmin));
        } catch {
          clearAuth();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    delete api.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  const login = async (data: AdminLoginRequest) => {
    const response = await adminLogin(data);

    localStorage.setItem(ADMIN_TOKEN_KEY, response.tokens.accessToken);
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.admin));

    api.defaults.headers.common['Authorization'] = `Bearer ${response.tokens.accessToken}`;
    setAdmin(response.admin);

    router.push('/admin/dashboard');
  };

  const logout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      isLoading,
      isAuthenticated: !!admin,
      login,
      logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
