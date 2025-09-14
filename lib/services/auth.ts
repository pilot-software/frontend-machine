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
    const response = await fetch('https://springboot-api.azurewebsites.net/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }

  async logout(): Promise<{ message: string }> {
    const response = await fetch('https://springboot-api.azurewebsites.net/api/auth/logout', { method: 'POST' });
    return response.json();
  }
}

export const authService = new AuthService();