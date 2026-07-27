import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin';
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEFAULT_ADMIN_EMAIL = 'genzlismhq@gmail.com';
const DEFAULT_ADMIN_PASS = 'Gerse@2026';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('nous_art_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!adminUser;

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('nous_art_admin_session', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('nous_art_admin_session');
    }
  }, [adminUser]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Trim and normalize input
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && pass === DEFAULT_ADMIN_PASS) {
      const user: AdminUser = {
        email: DEFAULT_ADMIN_EMAIL,
        name: 'Master Gallery Administrator',
        role: 'super_admin',
      };
      setAdminUser(user);
      return { success: true };
    }

    return { success: false, error: 'Invalid admin email or password credentials.' };
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('nous_art_admin_session');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
