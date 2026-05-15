import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { apiClient } from '../services/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Auto-load profile on mount if token exists
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiClient
      .getMe()
      .then((u) => setUser(u))
      .catch(() => {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (data: LoginRequest) => {
    const result = await apiClient.login(data);
    localStorage.setItem('token', result.access_token);
    setToken(result.access_token);
    const u = await apiClient.getMe();
    setUser(u);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    await apiClient.register(data);
    // After registration, log the user in automatically
    await login({ email: data.email, password: data.password });
  }, [login]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
