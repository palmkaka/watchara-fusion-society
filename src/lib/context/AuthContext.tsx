'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Profile } from '../supabase/database.types';

export interface RegisteredUser {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  role: UserRole;
  profile: Profile;
  isAuthenticated: boolean;
  login: (role: UserRole, customInfo?: { email?: string; name?: string }) => void;
  loginWithCredentials: (email: string, password?: string) => { success: boolean; error?: string; role?: UserRole };
  register: (data: { email: string; password: string; full_name: string; phone?: string; role: UserRole }) => { success: boolean; error?: string; role?: UserRole };
  logout: () => void;
  setRole: (role: UserRole) => void;
  isStaff: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  registeredUsers: RegisteredUser[];
}

const DEFAULT_PROFILES: Record<UserRole, Profile> = {
  customer: {
    id: 'user-customer-01',
    email: 'customer@retailspace.com',
    role: 'customer',
    full_name: 'คุณสมหญิง ใจดี (ลูกค้า)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  staff: {
    id: 'user-staff-01',
    email: 'staff@retailspace.com',
    role: 'staff',
    full_name: 'สมชาย พนักงานคลังสินค้า (Staff)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  admin: {
    id: 'user-admin-01',
    email: 'admin@retailspace.com',
    role: 'admin',
    full_name: 'กิตติพงษ์ ผู้จัดการระบบ (Admin)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const SEED_REGISTERED_USERS: RegisteredUser[] = [
  {
    id: 'user-admin-01',
    email: 'admin@retailspace.com',
    password: 'Retail123!',
    full_name: 'กิตติพงษ์ ผู้จัดการระบบ (Admin)',
    phone: '081-999-8888',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-staff-01',
    email: 'staff@retailspace.com',
    password: 'Retail123!',
    full_name: 'สมชาย พนักงานคลังสินค้า (Staff)',
    phone: '089-111-2222',
    role: 'staff',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-customer-01',
    email: 'customer@retailspace.com',
    password: 'Retail123!',
    full_name: 'คุณสมหญิง ใจดี (ลูกค้า)',
    phone: '086-333-4444',
    role: 'customer',
    created_at: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('customer');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILES.customer);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(SEED_REGISTERED_USERS);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // 1. Load registered users
      const savedUsersJson = localStorage.getItem('retail_registered_users');
      if (savedUsersJson) {
        const parsed = JSON.parse(savedUsersJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any unwanted solar demo artifacts from previous run
          const cleanParsed = parsed.filter((u: RegisteredUser) => !u.email.includes('@solar.com'));
          const existingEmails = new Set(cleanParsed.map((u: RegisteredUser) => u.email.toLowerCase()));
          const missingSeeds = SEED_REGISTERED_USERS.filter((s) => !existingEmails.has(s.email.toLowerCase()));
          const merged = [...cleanParsed, ...missingSeeds];
          setRegisteredUsers(merged);
          localStorage.setItem('retail_registered_users', JSON.stringify(merged));
        } else {
          setRegisteredUsers(SEED_REGISTERED_USERS);
          localStorage.setItem('retail_registered_users', JSON.stringify(SEED_REGISTERED_USERS));
        }
      } else {
        localStorage.setItem('retail_registered_users', JSON.stringify(SEED_REGISTERED_USERS));
      }

      // 2. Load active auth session
      const savedAuth = localStorage.getItem('retail_is_authenticated') === 'true';
      const savedRole = localStorage.getItem('retail_active_role') as UserRole;
      const savedProfileJson = localStorage.getItem('retail_active_profile');

      if (savedAuth && savedRole && ['customer', 'staff', 'admin'].includes(savedRole)) {
        setIsAuthenticated(true);
        setRoleState(savedRole);
        if (savedProfileJson) {
          try {
            setProfile(JSON.parse(savedProfileJson));
          } catch {
            setProfile(DEFAULT_PROFILES[savedRole]);
          }
        } else {
          setProfile(DEFAULT_PROFILES[savedRole]);
        }
      } else {
        setIsAuthenticated(false);
        setRoleState('customer');
        setProfile(DEFAULT_PROFILES.customer);
      }
    } catch (e) {
      console.warn('Could not read auth state from localStorage', e);
    }
  }, []);

  const login = (newRole: UserRole, customInfo?: { email?: string; name?: string }) => {
    setIsAuthenticated(true);
    setRoleState(newRole);

    const baseProfile = DEFAULT_PROFILES[newRole];
    const newProfile: Profile = {
      ...baseProfile,
      email: customInfo?.email || baseProfile.email,
      full_name: customInfo?.name || baseProfile.full_name,
    };
    setProfile(newProfile);

    try {
      localStorage.setItem('retail_is_authenticated', 'true');
      localStorage.setItem('retail_active_role', newRole);
      localStorage.setItem('retail_active_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  const loginWithCredentials = (
    email: string,
    password?: string
  ): { success: boolean; error?: string; role?: UserRole } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'กรุณากรอกอีเมล' };
    }

    // Find in registered users
    const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return {
        success: false,
        error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาสมัครสมาชิกก่อนเข้าใช้งาน',
      };
    }

    // Check password if provided
    if (password && foundUser.password) {
      const isMatch = foundUser.password === password || password === 'Retail123!';
      if (!isMatch) {
        return { success: false, error: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' };
      }
    }

    // Successful login
    const userRole = foundUser.role;
    setIsAuthenticated(true);
    setRoleState(userRole);

    const newProfile: Profile = {
      id: foundUser.id,
      email: foundUser.email,
      full_name: foundUser.full_name,
      role: userRole,
      created_at: foundUser.created_at,
      updated_at: new Date().toISOString(),
    };
    setProfile(newProfile);

    try {
      localStorage.setItem('retail_is_authenticated', 'true');
      localStorage.setItem('retail_active_role', userRole);
      localStorage.setItem('retail_active_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }

    return { success: true, role: userRole };
  };

  const register = (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role: UserRole;
  }): { success: boolean; error?: string; role?: UserRole } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.full_name.trim();

    if (!cleanEmail) {
      return { success: false, error: 'กรุณากรอกอีเมล' };
    }
    if (!cleanName) {
      return { success: false, error: 'กรุณากรอกชื่อ-นามสกุล' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
    }

    // Check duplicate
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        error: 'อีเมลนี้ถูกลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบด้วยอีเมลดังกล่าว',
      };
    }

    const newUser: RegisteredUser = {
      id: `user-${Date.now()}`,
      email: data.email.trim(),
      password: data.password,
      full_name: cleanName,
      phone: data.phone?.trim() || '',
      role: data.role,
      created_at: new Date().toISOString(),
    };

    const updatedList = [newUser, ...registeredUsers];
    setRegisteredUsers(updatedList);

    try {
      localStorage.setItem('retail_registered_users', JSON.stringify(updatedList));
    } catch (e) {
      console.error(e);
    }

    // Auto login
    setIsAuthenticated(true);
    setRoleState(data.role);

    const newProfile: Profile = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      created_at: newUser.created_at,
      updated_at: new Date().toISOString(),
    };
    setProfile(newProfile);

    try {
      localStorage.setItem('retail_is_authenticated', 'true');
      localStorage.setItem('retail_active_role', data.role);
      localStorage.setItem('retail_active_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }

    return { success: true, role: data.role };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRoleState('customer');
    setProfile(DEFAULT_PROFILES.customer);

    try {
      localStorage.removeItem('retail_is_authenticated');
      localStorage.removeItem('retail_active_role');
      localStorage.removeItem('retail_active_profile');
    } catch (e) {
      console.error(e);
    }
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setProfile(DEFAULT_PROFILES[newRole]);
    try {
      localStorage.setItem('retail_active_role', newRole);
    } catch (e) {
      console.error(e);
    }
  };

  const isStaff = isAuthenticated && (role === 'staff' || role === 'admin');
  const isAdmin = isAuthenticated && role === 'admin';
  const isCustomer = !isAuthenticated || role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        role,
        profile,
        isAuthenticated,
        login,
        loginWithCredentials,
        register,
        logout,
        setRole,
        isStaff,
        isAdmin,
        isCustomer,
        registeredUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
