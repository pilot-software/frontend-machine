export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "NURSE" | "PATIENT" | "FINANCE" | "RECEPTIONIST" | "TECHNICIAN";
  department?: string;
  specialization?: string;
  phone?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  private getBaseUrl() {
    return process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PROD_API_URL?.replace("/api", "") ||
          "https://springboot-api.azurewebsites.net"
      : process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
          "http://localhost:8080";
  }

  private getHeaders() {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getUsers(): Promise<ApiUser[]> {
    const response = await fetch(`${this.getBaseUrl()}/api/users`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getUsersByRole(role: string): Promise<ApiUser[]> {
    const response = await fetch(
      `${this.getBaseUrl()}/api/users/role/${role}`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.json();
  }

  async createUser(data: any): Promise<ApiUser> {
    const response = await fetch(`${this.getBaseUrl()}/api/users`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create user: ${response.status} - ${text}`);
    }
    return response.json();
  }
}

export const userService = new UserService();
