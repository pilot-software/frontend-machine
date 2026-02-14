import { api } from '../api';

export interface Permission {
  name: string;
  groups: string[];
  permissions: string[];
}

export interface PermissionGroup {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionCatalog {
  categories: PermissionCategory[];
  allPermissions: string[];
}

export interface PermissionCategory {
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

export interface AssignPermissionsRequest {
  permissions: string[];
  groupIds?: string[];
}

export type CreatePermissionGroup = Omit<PermissionGroup, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;

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

    return data.effectivePermissions.map((perm: string) => ({
      name: perm,
      groups: [],
      permissions: [perm],
    }));
  }

  async getEffectivePermissions(userId: string): Promise<EffectivePermissionsResponse> {
    return api.get(`/api/permissions/user/${userId}`);
  }

  async assignUserPermissions(userId: string, request: AssignPermissionsRequest): Promise<void> {
    return api.post(`/api/permissions/user/${userId}`, request);
  }

  async removeUserPermission(userId: string, permission: string): Promise<void> {
    return api.delete(`/api/permissions/user/${userId}/permission/${permission}`);
  }

  async getPermissionCatalog(): Promise<PermissionCatalog> {
    return api.get('/api/permissions/catalog');
  }

  async getPermissionGroups(): Promise<PermissionGroup[]> {
    return api.get('/api/permissions/groups');
  }

  async getPermissionGroup(id: string): Promise<PermissionGroup> {
    return api.get(`/api/permissions/groups/${id}`);
  }

  async createPermissionGroup(group: CreatePermissionGroup): Promise<PermissionGroup> {
    return api.post('/api/permissions/groups', group);
  }

  async updatePermissionGroup(id: string, group: Partial<CreatePermissionGroup>): Promise<PermissionGroup> {
    return api.put(`/api/permissions/groups/${id}`, group);
  }

  async deletePermissionGroup(id: string): Promise<void> {
    return api.delete(`/api/permissions/groups/${id}`);
  }

  async assignGroupToUser(userId: string, groupId: string): Promise<void> {
    return api.post(`/api/permissions/user/${userId}/group/${groupId}`, {});
  }

  async removeGroupFromUser(userId: string, groupId: string): Promise<void> {
    return api.delete(`/api/permissions/user/${userId}/group/${groupId}`);
  }

  async getUserGroups(userId: string): Promise<PermissionGroup[]> {
    const effective = await this.getEffectivePermissions(userId);
    return effective.groups;
  }

  hasPermission(effectivePermissions: string[], permission: string): boolean {
    return effectivePermissions.includes(permission);
  }

  hasAnyPermission(effectivePermissions: string[], permissions: string[]): boolean {
    return permissions.some(p => effectivePermissions.includes(p));
  }

  hasAllPermissions(effectivePermissions: string[], permissions: string[]): boolean {
    return permissions.every(p => effectivePermissions.includes(p));
  }

  groupPermissionsByCategory(permissions: string[]): Map<string, string[]> {
    const grouped = new Map<string, string[]>();
    permissions.forEach(perm => {
      const category = perm.split('_')[0];
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(perm);
    });
    return grouped;
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
