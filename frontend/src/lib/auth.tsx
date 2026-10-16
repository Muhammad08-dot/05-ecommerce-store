'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  login as mockLogin,
  register as mockRegister,
  currentUser,
  setSession,
} from '@/lib/mock';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; first_name: string; last_name: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Restore the demo session from localStorage on first load.
  useEffect(() => {
    setUser(currentUser());
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = mockLogin(email, password);
    setUser(u);
  }, []);

  const register = useCallback(
    async (payload: { email: string; first_name: string; last_name: string; password: string }) => {
      const u = mockRegister(payload);
      setUser(u);
    },
    [],
  );

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
