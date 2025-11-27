import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, getLoginUrl, logout as logoutAPI, getToken, removeToken, saveToken, type User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser(token);
      setUser(userData);
    } catch (error) {
      console.error('Failed to get user:', error);
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only refresh user if we're not on the callback page
    // The callback page will handle token processing
    if (window.location.pathname !== '/auth/callback') {
      refreshUser();
    }
  }, []);

  const login = async () => {
    try {
      console.log('Getting login URL...');
      const loginUrl = await getLoginUrl();
      console.log('Got login URL, redirecting to:', loginUrl);
      // Use window.location.assign to ensure navigation happens
      window.location.assign(loginUrl);
    } catch (error) {
      console.error('Failed to initiate login:', error);
      const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました';
      alert(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    const token = getToken();
    if (token) {
      try {
        await logoutAPI(token);
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    }
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
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

