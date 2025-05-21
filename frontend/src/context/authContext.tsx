// src/context/authContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/lib.ts';
import { User } from '@/types';

type AuthContextType = {
  user: User | null;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const setCurrentUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user: loggedInUser, token } = response.data;

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Navigate based on role
    if (loggedInUser.role === 'ADMIN') {
      navigate('/');
    } else if (loggedInUser.role === 'ATTENDANT') {
      navigate('/parks');
    } else {
      navigate('/');
    }
  };
  

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ) => {
    await api.post('/auth/signup', { firstName, lastName, email, password, role });

    // Don't auto-login or navigate based on role here — always go to /login
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    currentUser: user,
    setCurrentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
