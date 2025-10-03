'use client';

import {ThemeProvider} from '@/components/ThemeProvider';
import {StoreProvider} from '@/components/StoreProvider';
import {ApiErrorFallback, ErrorBoundary} from '@/components/ErrorBoundary';
import {AuthProvider} from '@/components/AuthContext';
import {BranchProvider} from '@/components/BranchContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={ApiErrorFallback}>
      <StoreProvider>
        <ThemeProvider>
          <AuthProvider>
            <BranchProvider>
              {children}
            </BranchProvider>
          </AuthProvider>
        </ThemeProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}
