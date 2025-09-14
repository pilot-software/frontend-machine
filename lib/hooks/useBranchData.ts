'use client';

import { useState, useEffect } from 'react';
import { useBranch } from '@/components/BranchContext';
import { apiClient } from '@/lib/api';

export function useBranchData<T>(
  fetchFn: (branchId?: string) => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedBranch, hasBranches } = useBranch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // For orgs without branches, don't pass branchId
        const branchId = hasBranches ? (selectedBranch === 'all' ? undefined : selectedBranch) : undefined;
        const result = await fetchFn(branchId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedBranch, hasBranches, ...deps]);

  return { data, isLoading, error, refetch: () => fetchData() };
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