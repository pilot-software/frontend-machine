"use client";

import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

function AuthFlowManager() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(`/${locale}/dashboard`);
      } else {
        router.replace(`/${locale}/login`);
      }
    }
  }, [user, isLoading, router, locale]);

  return null;
}

export default function HomePage() {
  return (
    <AuthProvider>
      <AuthFlowManager />
    </AuthProvider>
  );
}
