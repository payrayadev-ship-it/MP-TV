import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { initialUsers } from '../data/initialData';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  users: User[];
  hasPermission: (requiredRole: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleHierarchy: Record<UserRole, number> = {
  'Super Admin': 5,
  'Admin TV': 4,
  'Editor': 3,
  'Operator': 2,
  'Reporter': 1,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>((initialUsers || [])[0]); // Default Super Admin

  const switchRole = (role: UserRole) => {
    const found = (users || []).find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser({
        id: `u-temp-${Date.now()}`,
        name: `Pengguna (${role})`,
        email: `${role.toLowerCase().replace(' ', '')}@majalengkapost.tv`,
        role,
        active: true,
      });
    }
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    const currentLevel = roleHierarchy[currentUser.role] || 0;
    const minRequiredLevel = Math.min(...requiredRoles.map((r) => roleHierarchy[r] || 0));
    return currentLevel >= minRequiredLevel;
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, users, hasPermission }}>
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
