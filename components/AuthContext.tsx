'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "../lib/types";
import { storageService } from "../lib/services/storage.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, orgId: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = storageService.getItem("healthcare_user");
        const savedToken = storageService.getItem("auth_token");
        
        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setToken(savedToken);
          
          const { apiClient: newApiClient } = await import('../lib/api/client');
          const { apiClient: originalApiClient } = await import('../lib/api');
          newApiClient.setToken(savedToken);
          originalApiClient.setToken(savedToken);
          originalApiClient.setUserRole(userData.role?.toUpperCase());
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        storageService.removeItem("healthcare_user");
        storageService.removeItem("auth_token");
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
        
        const apiUser = createUserFromResponse(response);
        
        setUser(apiUser);
        setToken(response.token);
        saveUserSession(apiUser, response.token);
        setIsLoading(false);
        return true;
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

  const saveUserSession = (user: User, token: string) => {
    storageService.setItem('healthcare_user', JSON.stringify(user));
    storageService.setItem('auth_token', token);
  };

  const clearUserSession = () => {
    storageService.removeItem('healthcare_user');
    storageService.removeItem('auth_token');
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    // TODO: Implement password reset API call
    return false;
  };

  const verifyTwoFactor = async (_code: string): Promise<boolean> => {
    // TODO: Implement 2FA verification API call
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        resetPassword,
        verifyTwoFactor,
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
