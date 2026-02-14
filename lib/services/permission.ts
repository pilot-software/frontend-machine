import { api } from '../api';

export interface Permission {
  name: string;
  groups: string[];
  permissions: string[];
}

export interface PermissionCatalogItem {
  id: number;
  permissionCode: string;
  permissionName: string;
  category: string;
  isSystem: boolean;
}

export interface OrganizationPermission {
  id: number;
  permissionCode: string;
  permissionName: string;
  organizationId: string;
  isEnabled: boolean;
}

export interface PermissionGroup {
  id: number;
  groupName: string;
  description?: string;
  organizationId: string;
  permissions: string[];
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupRequest {
  groupName: string;
  description?: string;
  organizationPermissionIds: number[];
}

export interface AssignGroupsRequest {
  groupIds: number[];
}

export interface AssignCustomPermissionsRequest {
  permissions: Array<{
    permissionId: number;
    isGranted: boolean;
  }>;
}

export interface UserEffectivePermissionsResponse {
  userId: string;
  groups: PermissionGroup[];
  groupPermissions: string[];
  customPermissions: string[];
  effectivePermissions: string[];
  branchPermissions: Record<string, any>;
}

export interface PermissionCatalog {
  categories: PermissionCategory[];
  allPermissions: string[];
}

export interface PermissionCategory {
  name: string;
  permissions: string[];
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
  // Permission Catalog APIs
  async getPermissionCatalog(): Promise<PermissionCatalogItem[]> {
    const baseUrl = await this.getBaseUrl('/api/permissions/catalog');
    const response = await fetch(`${baseUrl}/api/permissions/catalog`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permission catalog: ${response.status}`);
    }

    return response.json();
  }

  async createPermission(request: { permissionCode: string; permissionName: string; category: string }): Promise<PermissionCatalogItem> {
    const baseUrl = await this.getBaseUrl('/api/permissions/catalog');
    const response = await fetch(`${baseUrl}/api/permissions/catalog`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to create permission: ${response.status}`);
    }

    return response.json();
  }

  // Organization Permission APIs
  async getOrganizationPermissions(): Promise<OrganizationPermission[]> {
    const baseUrl = await this.getBaseUrl('/api/permissions/organization');
    const response = await fetch(`${baseUrl}/api/permissions/organization/permissions`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organization permissions: ${response.status}`);
    }

    return response.json();
  }

  async assignPermissionToOrganization(permissionId: number): Promise<OrganizationPermission> {
    const baseUrl = await this.getBaseUrl('/api/permissions/organization');
    const response = await fetch(`${baseUrl}/api/permissions/organization/permissions/${permissionId}/assign`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to assign permission to organization: ${response.status}`);
    }

    return response.json();
  }

  async toggleOrganizationPermission(orgPermissionId: number, isEnabled: boolean): Promise<void> {
    const baseUrl = await this.getBaseUrl('/api/permissions/organization');
    const response = await fetch(`${baseUrl}/api/permissions/organization/permissions/${orgPermissionId}/toggle`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ isEnabled })
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle permission: ${response.status}`);
    }
  }

  // Permission Group APIs
  async getPermissionGroups(): Promise<PermissionGroup[]> {
    const baseUrl = await this.getBaseUrl('/api/permissions/groups');
    const response = await fetch(`${baseUrl}/api/permissions/groups`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permission groups: ${response.status}`);
    }

    return response.json();
  }

  async getPermissionGroup(id: number): Promise<PermissionGroup> {
    const baseUrl = await this.getBaseUrl('/api/permissions/groups');
    const response = await fetch(`${baseUrl}/api/permissions/groups/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch permission group: ${response.status}`);
    }

    return response.json();
  }

  async createPermissionGroup(request: CreateGroupRequest): Promise<PermissionGroup> {
    const baseUrl = await this.getBaseUrl('/api/permissions/groups');
    const response = await fetch(`${baseUrl}/api/permissions/groups`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to create permission group: ${response.status}`);
    }

    return response.json();
  }

  async updatePermissionGroup(id: number, request: CreateGroupRequest): Promise<PermissionGroup> {
    const baseUrl = await this.getBaseUrl('/api/permissions/groups');
    const response = await fetch(`${baseUrl}/api/permissions/groups/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to update permission group: ${response.status}`);
    }

    return response.json();
  }

  async deletePermissionGroup(id: number): Promise<void> {
    const baseUrl = await this.getBaseUrl('/api/permissions/groups');
    const response = await fetch(`${baseUrl}/api/permissions/groups/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete permission group: ${response.status}`);
    }
  }

  // User Permission APIs
  async getUserEffectivePermissions(userId: string): Promise<UserEffectivePermissionsResponse> {
    const baseUrl = await this.getBaseUrl('/api/permissions/users');
    const response = await fetch(`${baseUrl}/api/permissions/users/${userId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user permissions: ${response.status}`);
    }

    return response.json();
  }

  async assignGroupsToUser(userId: string, request: AssignGroupsRequest): Promise<void> {
    const baseUrl = await this.getBaseUrl('/api/permissions/users');
    const response = await fetch(`${baseUrl}/api/permissions/users/${userId}/groups`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to assign groups to user: ${response.status}`);
    }
  }

  async removeGroupFromUser(userId: string, groupId: number): Promise<void> {
    const baseUrl = await this.getBaseUrl('/api/permissions/users');
    const response = await fetch(`${baseUrl}/api/permissions/users/${userId}/groups/${groupId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove group from user: ${response.status}`);
    }
  }

  async assignCustomPermissions(userId: string, request: AssignCustomPermissionsRequest): Promise<void> {
    const baseUrl = await this.getBaseUrl('/api/permissions/users');
    const response = await fetch(`${baseUrl}/api/permissions/users/${userId}/custom`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to assign custom permissions: ${response.status}`);
    }
  }

  async revokeCustomPermission(userId: string, permissionId: number): Promise<void> {
    const baseUrl = await this.getBaseUrl('/api/permissions/users');
    const response = await fetch(`${baseUrl}/api/permissions/users/${userId}/custom/${permissionId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to revoke custom permission: ${response.status}`);
    }
  }

  // Legacy methods for backward compatibility
  async getAllPermissions(): Promise<Permission> {
    const orgPerms = await this.getOrganizationPermissions();
    return {
      name: 'organization_permissions',
      groups: [],
      permissions: orgPerms.map(p => p.permissionCode)
    };
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const data = await this.getUserEffectivePermissions(userId);
    return data.effectivePermissions.map((perm: string) => ({
      name: perm,
      groups: [],
      permissions: [perm],
    }));
  }

  async getEffectivePermissions(userId: string): Promise<UserEffectivePermissionsResponse> {
    return this.getUserEffectivePermissions(userId);
  }

  async assignUserPermissions(userId: string, request: AssignPermissionsRequest): Promise<void> {
    if (request.groupIds && request.groupIds.length > 0) {
      await this.assignGroupsToUser(userId, { groupIds: request.groupIds.map(id => parseInt(id)) });
    }
  }

  async removeUserPermission(userId: string, permission: string): Promise<void> {
    // This would need to be implemented based on specific requirements
    console.warn('removeUserPermission not implemented for new API structure');
  }

  async assignGroupToUser(userId: string, groupId: string): Promise<void> {
    await this.assignGroupsToUser(userId, { groupIds: [parseInt(groupId)] });
  }

  async getUserGroups(userId: string): Promise<PermissionGroup[]> {
    const effective = await this.getUserEffectivePermissions(userId);
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
    return "http://localhost:8080";
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
