export const getApiBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

export const API_CONFIG = {
    baseUrl: getApiBaseUrl(),
    timeout: 30000,
    retries: 3
};
