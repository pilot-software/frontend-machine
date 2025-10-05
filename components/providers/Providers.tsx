'use client';

import {ThemeProvider} from '@/components/providers/ThemeProvider';
import {StoreProvider} from '@/components/providers/StoreProvider';
import {ApiErrorFallback, ErrorBoundary} from '@/components/shared/utils/ErrorBoundary';
import {AuthProvider} from '@/components/providers/AuthContext';
import {BranchProvider} from '@/components/providers/BranchContext';

export function Providers({children}: { children: React.ReactNode }) {
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
