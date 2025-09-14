'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../lib/types";

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
    // Check for existing session on mount
    try {
      const savedUser = localStorage.getItem("healthcare_user");
      const savedToken = localStorage.getItem("auth_token");
      
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        // Initialize API client with saved token
        import('../lib/api').then(({ apiClient }) => {
          apiClient.setToken(savedToken);
          console.log('API client initialized with saved token');
        });
      }
    } catch (error) {
      console.error("Failed to load user from localStorage:", error);
      localStorage.removeItem("healthcare_user");
      localStorage.removeItem("auth_token");
    }
    setIsLoading(false);
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
        
        // Immediately set token in API client
        const { apiClient } = await import('../lib/api');
        apiClient.setToken(response.token);
        
        const apiUser: User = {
          id: response.id,
          email: response.email,
          name: response.email.split('@')[0],
          role: response.role.toLowerCase() as any,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUser(apiUser);
        setToken(response.token);
        localStorage.setItem('healthcare_user', JSON.stringify(apiUser));
        localStorage.setItem('auth_token', response.token);
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
    localStorage.removeItem("healthcare_user");
    localStorage.removeItem("auth_token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    try {
      // TODO: Implement password reset API call
      return false;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const verifyTwoFactor = async (_code: string): Promise<boolean> => {
    try {
      // TODO: Implement 2FA verification API call
      return false;
    } catch (error) {
      console.error('2FA verification error:', error);
      return false;
    }
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
