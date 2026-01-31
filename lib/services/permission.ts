export interface Permission {
  name: string;
  groups: string[];
  permissions: string[];
}

export interface PermissionGroup {
  id: number;
  name: string;
  permissions: string[];
}

export interface EffectivePermissionsResponse {
  userId: string;
  groups: PermissionGroup[];
  groupPermissions: string[];
  customPermissions: string[];
  effectivePermissions: string[];
  branchPermissions: Record<string, any>;
}

export interface UserPermissions {
  userId: string;
  permissions: Permission;
}

export class PermissionService {
  async getAllPermissions(): Promise<Permission> {
    const baseUrl = await this.getBaseUrl('/api/permissions/organization');
    const response = await fetch(`${baseUrl}/api/permissions/organization/permissions`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.status}`);
    }

    return response.json();
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const baseUrl = await this.getBaseUrl('/api/permissions/users');
    const response = await fetch(
      `${baseUrl}/api/permissions/users/${userId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user permissions: ${response.status}`);
    }

    const data: EffectivePermissionsResponse = await response.json();

    // Use effectivePermissions array directly as per integration guide
    return data.effectivePermissions.map((perm: string) => ({
      name: perm,
      groups: [],
      permissions: [perm],
    }));
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
