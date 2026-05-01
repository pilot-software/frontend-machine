import { unstable_cache } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

function serverFetch<T>(endpoint: string): Promise<T> {
    return fetch(`${BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 },
    }).then(res => {
        if (!res.ok) throw new Error(`API ${res.status}: ${endpoint}`);
        return res.json();
    });
}

export const getCachedDashboardStats = unstable_cache(
    (branchId?: string) =>
        serverFetch(`/api/ops/dashboard/stats${branchId ? `?branchId=${branchId}` : ''}`),
    ['dashboard-stats'],
    { revalidate: 60, tags: ['dashboard'] }
);

export const getCachedPatients = unstable_cache(
    () => serverFetch('/api/patients'),
    ['patients-list'],
    { revalidate: 120, tags: ['patients'] }
);

export const getCachedAppointments = unstable_cache(
    (date?: string) =>
        serverFetch(`/api/appointments${date ? `?date=${date}` : ''}`),
    ['appointments-list'],
    { revalidate: 30, tags: ['appointments'] }
);

export const getCachedAnalytics = unstable_cache(
    (branchId?: string) =>
        serverFetch(`/api/ops/dashboard/analytics${branchId ? `?branchId=${branchId}` : ''}`),
    ['analytics-data'],
    { revalidate: 300, tags: ['analytics'] }
);
