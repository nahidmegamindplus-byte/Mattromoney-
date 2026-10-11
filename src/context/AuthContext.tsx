'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'MODERATOR' | 'FINANCE_ADMIN' | 'SUPER_ADMIN';
  biodata?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  activeSubscription: any | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  activeSubscription: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setActiveSubscription(data.activeSubscription || null);
        } else {
          setUser(null);
          setActiveSubscription(null);
        }
      }
    } catch {
      setUser(null);
      setActiveSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = (token: string, userData: AuthUser) => {
    setUser(userData);
    fetchCurrentUser();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setActiveSubscription(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeSubscription,
        loading,
        login,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
