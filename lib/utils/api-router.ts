export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'FINANCE' | 'PATIENT' | 'RECEPTIONIST';

export const getEndpoint = (userRole: UserRole, endpoint: string): string => {
  // Based on actual Swagger endpoints
  
  // Customer APIs (available to all roles)
  const customerEndpoints = ['/patients', '/appointments', '/billing', '/users', '/organizations', '/departments', '/medical-records', '/medical/', '/lab-orders', '/files', '/config', '/auth'];
  
  if (customerEndpoints.some(ep => endpoint.startsWith(ep))) {
    return `/api${endpoint}`;
  }
  
  // Operations APIs (staff only)
  if (endpoint.startsWith('/dashboard/')) {
    return `/api/ops/dashboard/stats`;
  }
  
  if (endpoint.startsWith('/queues')) {
    if (endpoint === '/queues') {
      const queueType = userRole === 'DOCTOR' ? 'medical' : 'nursing';
      return `/api/ops/queues/${queueType}`;
    }
    return `/api/ops${endpoint}`;
  }
  
  // Operations-only endpoints
  const opsEndpoints = ['/branches', '/financial', '/system', '/payments'];
  if (opsEndpoints.some(ep => endpoint.startsWith(ep))) {
    return `/api/ops${endpoint}`;
  }
  
  // Admin endpoints
  if (endpoint.startsWith('/admin/')) {
    return `/api${endpoint}`;
  }
  
  // Default to customer API
  return `/api${endpoint}`;
};

export const handleApiResponse = async (response: Response) => {
  if (response.status === 403) {
    throw new Error('Access denied. Contact administrator.');
  }
  
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw new Error('Authentication required');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
};