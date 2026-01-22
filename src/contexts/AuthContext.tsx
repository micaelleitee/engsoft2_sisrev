import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'ALUNO' | 'PROFESSOR') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@sisrev:token';
const USER_KEY = '@sisrev:user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user)),
      ]);

      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.error || 'Erro ao fazer login');
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role?: 'ALUNO' | 'PROFESSOR'
  ) => {
    try {
      const response = await ApiService.register({ email, password, name, role });
      
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user)),
      ]);

      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.error || 'Erro ao registrar');
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
