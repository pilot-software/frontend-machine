// Microservices Configuration for Azure
export const MICROSERVICES = {
  AUTH: 'https://engine-auth-service.azurewebsites.net',
  PATIENT: 'https://engine-patient-service.azurewebsites.net',
  APPOINTMENT: 'https://engine-appointment-service.azurewebsites.net',
  DASHBOARD: 'https://engine-dashboard-service.azurewebsites.net',
  ADMIN: 'https://engine-admin-service.azurewebsites.net',
  PERMISSION: 'https://engine-permission-service.azurewebsites.net',
  BILLING: 'https://engine-billing-service.azurewebsites.net',
  LAB: 'https://engine-lab-service.azurewebsites.net',
};

// Development fallback (all routes to localhost)
const DEV_BASE = 'http://localhost:8080';

export const getMicroserviceUrl = (endpoint: string): string => {
  if (process.env.NODE_ENV !== 'production') {
    return DEV_BASE;
  }

  // Patient service - check first for /users routes
  if (endpoint.startsWith('/users')) return MICROSERVICES.PATIENT;
  
  // Auth endpoints
  if (endpoint.startsWith('/api/auth')) return MICROSERVICES.AUTH;
  
  // Appointment endpoints
  if (endpoint.startsWith('/api/appointments')) return MICROSERVICES.APPOINTMENT;
  
  // Dashboard endpoints
  if (endpoint.startsWith('/api/dashboard') || endpoint.startsWith('/api/ops/dashboard')) {
    return MICROSERVICES.DASHBOARD;
  }
  
  // Admin/Operations endpoints
  if (endpoint.startsWith('/api/admin') ||
      endpoint.startsWith('/api/ops/branches') || 
      endpoint.startsWith('/api/ops/queues') || 
      endpoint.startsWith('/api/ops/system')) {
    return MICROSERVICES.ADMIN;
  }
  
  // Permission endpoints
  if (endpoint.startsWith('/api/permissions')) return MICROSERVICES.PERMISSION;
  
  // Billing endpoints
  if (endpoint.startsWith('/api/billing')) return MICROSERVICES.BILLING;
  
  // Lab endpoints
  if (endpoint.startsWith('/api/lab-results') || endpoint.startsWith('/lab-results')) {
    return MICROSERVICES.LAB;
  }
  
  // Patient service (patients, departments, visits, vitals, prescriptions, medical)
  if (endpoint.startsWith('/api/patients') || 
      endpoint.startsWith('/api/users') ||
      endpoint.startsWith('/departments') ||
      endpoint.startsWith('/visits') ||
      endpoint.startsWith('/vitals') ||
      endpoint.startsWith('/prescriptions') ||
      endpoint.startsWith('/medical')) {
    return MICROSERVICES.PATIENT;
  }
  
  // Default to patient service
  return MICROSERVICES.PATIENT;
};
