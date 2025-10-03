'use client';

import {useEffect, useRef, useState} from 'react';
import {useBranch} from '@/components/BranchContext';
import {apiClient} from '@/lib/api';

// Request cache to prevent duplicates
const requestCache = new Map<string, Promise<any>>();

export function useBranchData<T>(
  fetchFn: (branchId?: string) => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedBranch, hasBranches } = useBranch();
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Cancel previous request
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const branchId = hasBranches ? (selectedBranch === 'all' ? undefined : selectedBranch) : undefined;
        const cacheKey = `${fetchFn.name}-${branchId || 'all'}`;

        // Check cache first
        if (requestCache.has(cacheKey)) {
          const result = await requestCache.get(cacheKey);
          if (!abortController.current?.signal.aborted) {
            setData(result);
          }
        } else {
          // Create new request and cache it
          const request = fetchFn(branchId);
          requestCache.set(cacheKey, request);

          const result = await request;
          if (!abortController.current?.signal.aborted) {
            setData(result);
          }

          // Clear cache after 30 seconds
          setTimeout(() => requestCache.delete(cacheKey), 30000);
        }
      } catch (err) {
        if (!abortController.current?.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (!abortController.current?.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [selectedBranch, hasBranches, ...deps]);

  const refetch = () => {
    const branchId = hasBranches ? (selectedBranch === 'all' ? undefined : selectedBranch) : undefined;
    const cacheKey = `${fetchFn.name}-${branchId || 'all'}`;
    requestCache.delete(cacheKey);
    // Trigger re-fetch by updating deps
  };

  return { data, isLoading, error, refetch };
}

// Specific hooks for common data types
export function usePatients() {
  return useBranchData((branchId) => apiClient.getPatients(branchId));
}

export function useAppointments() {
  return useBranchData((branchId) => apiClient.getAppointments(branchId));
}

export function useDashboardData() {
  return useBranchData((branchId) => apiClient.getDashboardData(branchId));
}
