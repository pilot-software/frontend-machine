"use client";

import { useAuth } from "@/components/providers/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export function AuthGuard({ children, requiredPermissions }: AuthGuardProps) {
  const { user, isLoading, hasAnyPermission } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`);
      return;
    }

    if (user && requiredPermissions) {
      console.log('[AuthGuard] Required permissions:', requiredPermissions);
      console.log('[AuthGuard] User has permissions:', hasAnyPermission(requiredPermissions));
      
      if (!hasAnyPermission(requiredPermissions)) {
        console.log("Access denied: insufficient permissions");
        router.push(`/${locale}/dashboard`);
        return;
      }
    }
  }, [user, isLoading, requiredPermissions, hasAnyPermission, router, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
