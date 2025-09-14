

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "NURSE" | "PATIENT" | "FINANCE";
  department?: string;
  specialization?: string;
  phone?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getUsers(): Promise<ApiUser[]> {
    const response = await fetch('https://springboot-api.azurewebsites.net/api/users', {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getUsersByRole(role: string): Promise<ApiUser[]> {
    const response = await fetch(`https://springboot-api.azurewebsites.net/api/users/role/${role}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }
}

export const userService = new UserService();