import { getMicroserviceUrl } from './microservices.config';

const API_ENDPOINTS = {
    development: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
    production: 'https://engine-patient-service.azurewebsites.net/api' // Default fallback
};

export const getApiBaseUrl = (): string => {
    const env = process.env.NODE_ENV || 'development';
    return API_ENDPOINTS[env as keyof typeof API_ENDPOINTS];
};

export const API_CONFIG = {
    baseUrl: getApiBaseUrl(),
    timeout: 30000,
    retries: 3
};

// Use microservices routing for production
export { getMicroserviceUrl };
