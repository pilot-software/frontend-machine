export interface Permission {
  name: string;
  groups: string[];
  permissions: string[];
}

export interface UserPermissions {
  userId: string;
  permissions: Permission;
}

export class PermissionService {
  async getAllPermissions(): Promise<Permission> {
    const baseUrl = await this.getBaseUrl('/api/permissions/all');
    const response = await fetch(`${baseUrl}/api/permissions/all`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.status}`);
    }

    return response.json();
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const baseUrl = await this.getBaseUrl('/api/permissions/user');
    const response = await fetch(
      `${baseUrl}/api/permissions/user/${userId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user permissions: ${response.status}`);
    }

    const data = await response.json();

    // Handle case where API returns array of strings instead of Permission objects
    if (Array.isArray(data.permissions)) {
      return data.permissions.map((perm: string) => ({
        name: perm,
        groups: [perm],
        permissions: [perm],
      }));
    }

    // Handle case where API returns array of strings directly
    if (Array.isArray(data) && typeof data[0] === "string") {
      return data.map((perm: string) => ({
        name: perm,
        groups: [perm],
        permissions: [perm],
      }));
    }

    return data;
  }

  private async getBaseUrl(endpoint: string = '') {
    if (process.env.NODE_ENV === "production") {
      const { getMicroserviceUrl } = await import('../config/microservices.config');
      return getMicroserviceUrl(endpoint);
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:8080";
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }
}

export const permissionService = new PermissionService();
