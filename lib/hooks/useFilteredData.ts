import { useMemo } from 'react';
import { useAuth } from '@/components/AuthContext';

export function useFilteredData<T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  activeFilters: Record<string, string>,
  searchFields: (keyof T)[],
  filterFields: Record<string, keyof T>
) {
  const { user } = useAuth();

  return useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = searchFields.some(field => 
        String(item[field] || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
        const field = filterFields[key];
        return field ? item[field] === value : true;
      });

      // Role-based filtering for patients
      if ('email' in item && user?.role === "patient") {
        return matchesSearch && matchesFilters && item.email === user.email;
      }

      if ('id' in item && user?.role === "doctor" && 'email' in item) {
        return matchesSearch && matchesFilters && user.assignedPatients?.includes(item.id);
      }

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, activeFilters, searchFields, filterFields, user]);
}