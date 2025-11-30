export interface LoginRequest {
    email: string;
    password: string;
    organizationId: string;
}

export interface LoginResponse {
    token: string;
    email: string;
    role: "ADMIN" | "DOCTOR" | "NURSE" | "PATIENT" | "FINANCE";
    id: string;
}

export class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const baseUrl = await this.getBaseUrl('/api/auth/login');
        const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        });
        return response.json();
    }

    async logout(): Promise<{ message: string }> {
        const baseUrl = await this.getBaseUrl('/api/auth/logout');
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const response = await fetch(`${baseUrl}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });
        return response.json();
    }

    private async getBaseUrl(endpoint: string = '') {
        if (process.env.NODE_ENV === 'production') {
            const { getMicroserviceUrl } = await import('../config/microservices.config');
            return getMicroserviceUrl(endpoint);
        }
        return process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
    }
}

export const authService = new AuthService();
