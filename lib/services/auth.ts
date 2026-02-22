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
    organizationId?: string;
}

export interface ForgotPasswordRequest {
    email: string;
    organizationId: string;
}

export interface ForgotPasswordResponse {
    token: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message?: string;
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

    async forgotPassword(email: string, organizationId: string): Promise<ForgotPasswordResponse> {
        const baseUrl = await this.getBaseUrl('/api/auth/forgot-password');
        const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, organizationId })
        });
        if (!response.ok) throw new Error('Failed to send reset link');
        return response.json();
    }

    async confirmResetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
        const baseUrl = await this.getBaseUrl('/api/auth/reset-password');
        const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });
        if (!response.ok) throw new Error('Failed to reset password');
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
