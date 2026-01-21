'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, saveTokens, clearTokens, getStoredTokens } from '@/lib/auth';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初期ロード時にトークンからユーザー情報を復元
  useEffect(() => {
    const initAuth = async () => {
      const { accessToken } = getStoredTokens();
      
      if (accessToken) {
        try {
          // プロフィールAPIからユーザー情報を取得
          const response = await api.get('/api/profile');
          if (response.data.success) {
            const profile = response.data.data;
            setUser({
              id: profile.userId,
              username: profile.username,
              email: '', // プロフィールにはメールがないため空
              emailVerified: true,
              planType: 'FREE', // プロフィールからは取得できないためデフォルト
            });
          }
        } catch (error) {
          // トークンが無効な場合はクリア
          clearTokens();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (response: AuthResponse) => {
    saveTokens(response.tokens);
    setUser(response.user);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
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
