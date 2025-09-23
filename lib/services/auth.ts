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
  private getBaseUrl() {
    return process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_PROD_API_URL?.replace('/api', '') || 'https://springboot-api.azurewebsites.net'
      : process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.getBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }

  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${this.getBaseUrl()}/api/auth/logout`, { method: 'POST' });
    return response.json();
  }
}

export const authService = new AuthService();