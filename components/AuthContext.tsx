'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import {User, UserRole} from "../lib/types";
import {storageService} from "../lib/services/storage.service";
import {Permission, permissionService} from "../lib/services/permission";

interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  login: (email: string, password: string, orgId: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = storageService.getItem("healthcare_user");
        const savedToken = storageService.getItem("auth_token");

        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          const savedPermissions = storageService.getItem("user_permissions");

          setUser(userData);
          setToken(savedToken);

          if (savedPermissions) {
            const parsedPermissions = JSON.parse(savedPermissions);
            setPermissions(Array.isArray(parsedPermissions) ? parsedPermissions : []);
          }

          const { apiClient: newApiClient } = await import('../lib/api/client');
          const { apiClient: originalApiClient } = await import('../lib/api');
          newApiClient.setToken(savedToken);
          originalApiClient.setToken(savedToken);
          originalApiClient.setUserRole(userData.role?.toUpperCase());

          // Ensure token is available for permission service
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', savedToken);
          }
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        storageService.removeItem("healthcare_user");
        storageService.removeItem("auth_token");
        storageService.removeItem("user_permissions");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const login = async (
    email: string,
    password: string,
    orgId: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      if (!email || !password || !orgId) {
        setIsLoading(false);
        return false;
      }

      const { authService } = await import('../lib/services/auth');
      const response = await authService.login({
        email: email.trim(),
        password: password.trim(),
        organizationId: orgId
      });

      if (response.token) {
        console.log('Login successful, token received:', response.token.substring(0, 20) + '...');

        const { apiClient: newApiClient } = await import('../lib/api/client');
        const { apiClient: originalApiClient } = await import('../lib/api');
        newApiClient.setToken(response.token);
        originalApiClient.setToken(response.token);
        originalApiClient.setUserRole(response.role);

        // Ensure token is available for all API calls
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.token);
        }

        const apiUser = createUserFromResponse(response);

        // Fetch user permissions after successful login
        try {
          const userPermissions = await permissionService.getUserPermissions(response.id);
          const validPermissions = Array.isArray(userPermissions) ? userPermissions : [];
          setPermissions(validPermissions);

          setUser(apiUser);
          setToken(response.token);
          saveUserSession(apiUser, response.token, validPermissions);
          setIsLoading(false);
          return true;
        } catch (permError) {
          console.error('Failed to fetch user permissions:', permError);
          setUser(apiUser);
          setToken(response.token);
          setPermissions([]);
          saveUserSession(apiUser, response.token, []);
          setIsLoading(false);
          return true;
        }
      } else {
        console.log('Login response missing token:', response);
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { authService } = await import('../lib/services/auth');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    setUser(null);
    setToken(null);
    setPermissions([]);
    clearUserSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const createUserFromResponse = (response: any): User => {
    // Map API role names to internal role names
    const roleMapping: Record<string, UserRole> = {
      'ADMIN': 'admin',
      'DOCTOR': 'doctor',
      'NURSE': 'nurse',
      'PATIENT': 'patient',
      'FINANCE': 'finance',
      'RECEPTIONIST': 'receptionist',
      'TECHNICIAN': 'technician'
    };

    const mappedRole = roleMapping[response.role] || response.role.toLowerCase();

    return {
      id: response.id,
      email: response.email,
      name: response.email.split('@')[0],
      role: mappedRole as UserRole,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const saveUserSession = (user: User, token: string, permissions: Permission[]) => {
    storageService.setItem('healthcare_user', JSON.stringify(user));
    storageService.setItem('auth_token', token);
    storageService.setItem('user_permissions', JSON.stringify(permissions));
  };

  const clearUserSession = () => {
    storageService.removeItem('healthcare_user');
    storageService.removeItem('auth_token');
    storageService.removeItem('user_permissions');
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    // TODO: Implement password reset API call
    return false;
  };

  const verifyTwoFactor = async (_code: string): Promise<boolean> => {
    // TODO: Implement 2FA verification API call
    return false;
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.some(p => p.name === permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        login,
        logout,
        isLoading,
        resetPassword,
        verifyTwoFactor,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Make sure to wrap your component with <AuthProvider>."
    );
  }
  return context;
}
