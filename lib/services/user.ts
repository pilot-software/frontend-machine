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
    async getUsers(): Promise<ApiUser[]> {
        const baseUrl = await this.getBaseUrl('/api/users');
        const response = await fetch(`${baseUrl}/api/users`, {
            headers: this.getHeaders(),
        });
        return response.json();
    }

    async getUsersByRole(role: string): Promise<ApiUser[]> {
        const baseUrl = await this.getBaseUrl('/api/users/role');
        const response = await fetch(
            `${baseUrl}/api/users/role/${role}`,
            {
                headers: this.getHeaders(),
            }
        );
        return response.json();
    }

    async createUser(data: any): Promise<ApiUser> {
        const baseUrl = await this.getBaseUrl('/api/users');
        const response = await fetch(`${baseUrl}/api/users`, {
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

    private async getBaseUrl(endpoint: string = '') {
        if (process.env.NODE_ENV === "production") {
            const { getMicroserviceUrl } = await import('../config/microservices.config');
            return getMicroserviceUrl(endpoint);
        }
        return process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:8080";
    }

    private getHeaders() {
        const token = localStorage.getItem("auth_token");
        return {
            "Content-Type": "application/json",
            ...(token && {Authorization: `Bearer ${token}`}),
        };
    }
}

export const userService = new UserService();
