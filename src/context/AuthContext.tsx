import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  login: (email: string, password: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fj_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isOwner = !!user && (
    user.email?.toLowerCase().trim() === 'nazneenrizvi1711@gmail.com' ||
    user.isOwner === true ||
    user.role === 'owner'
  );

  const login = async (email: string, password: string, name?: string) => {
    // Quick validation
    if (!email || !password) {
      return { success: false, message: 'Please enter valid email and password' };
    }
    const isOwnerUser = email.toLowerCase().trim() === 'nazneenrizvi1711@gmail.com' || email.toLowerCase().includes('nazneen');
    const simulatedUser: User = {
      id: `usr_${Date.now()}`,
      name: name || (isOwnerUser ? 'Nazneen (Store Owner)' : email.split('@')[0].replace(/[._]/g, ' ')),
      email,
      role: isOwnerUser ? 'owner' : 'customer',
      isOwner: isOwnerUser,
      token: `jwt_token_${Math.random().toString(36).substring(2)}`
    };
    setUser(simulatedUser);
    localStorage.setItem('fj_user', JSON.stringify(simulatedUser));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }
    const isOwnerUser = email.toLowerCase().trim() === 'nazneenrizvi1711@gmail.com' || email.toLowerCase().includes('nazneen');
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: isOwnerUser ? (name || 'Nazneen (Store Owner)') : name,
      email,
      role: isOwnerUser ? 'owner' : 'customer',
      isOwner: isOwnerUser,
      token: `jwt_token_${Math.random().toString(36).substring(2)}`
    };
    setUser(newUser);
    localStorage.setItem('fj_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fj_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOwner,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
