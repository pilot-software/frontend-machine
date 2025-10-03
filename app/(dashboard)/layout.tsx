'use client';

import {AuthProvider} from '@/components/AuthContext';
import {AuthGuard} from '@/components/AuthGuard';
import {DashboardLayout} from '@/components/DashboardLayout';
import {SessionManager} from '@/components/SessionManager';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SessionManager>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </SessionManager>
      </AuthGuard>
    </AuthProvider>
  );
}
