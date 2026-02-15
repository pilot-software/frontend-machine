// Centralized API service for permissions
class PermissionApiService {
  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      'Content-Type': 'application/json',
    };
  }

  // Permission Catalog APIs
  async getPermissionCatalog() {
    const response = await fetch('/api/permissions/catalog', {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async createSystemPermission(permission: any) {
    const response = await fetch('/api/permissions/catalog', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(permission)
    });
    return response.json();
  }

  async updateSystemPermission(id: string, permission: any) {
    const response = await fetch(`/api/permissions/catalog/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(permission)
    });
    return response.json();
  }

  async distributePermission(id: string, organizationIds: string[]) {
    const response = await fetch(`/api/permissions/catalog/${id}/distribute`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ organizationIds })
    });
    return response.json();
  }

  async getSystemPermissions() {
    const response = await fetch('/api/permissions/catalog/system', {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Organization Permissions APIs
  async getOrganizationPermissions() {
    const response = await fetch('/api/permissions/organization/permissions', {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async assignPermissionToOrganization(permissionId: string) {
    const response = await fetch(`/api/permissions/organization/permissions/${permissionId}/assign`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async toggleOrganizationPermission(permissionId: string, isEnabled: boolean) {
    const response = await fetch(`/api/permissions/organization/permissions/${permissionId}/toggle`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ isEnabled })
    });
    return response.json();
  }

  // Permission Groups APIs
  async getPermissionGroups() {
    const response = await fetch('/api/permissions/groups', {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async createPermissionGroup(group: any) {
    const response = await fetch('/api/permissions/groups', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(group)
    });
    return response.json();
  }

  async getPermissionGroup(id: string) {
    const response = await fetch(`/api/permissions/groups/${id}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updatePermissionGroup(id: string, group: any) {
    const response = await fetch(`/api/permissions/groups/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(group)
    });
    return response.json();
  }

  async deletePermissionGroup(id: string) {
    const response = await fetch(`/api/permissions/groups/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.ok;
  }

  async getPermissionGroupHistory(id: string) {
    const response = await fetch(`/api/permissions/groups/${id}/history`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // User Permissions APIs
  async getUserEffectivePermissions(userId: string) {
    const response = await fetch(`/api/permissions/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async assignGroupsToUser(userId: string, groupIds: number[]) {
    const response = await fetch(`/api/permissions/users/${userId}/groups`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ groupIds })
    });
    return response.json();
  }

  async removeGroupFromUser(userId: string, groupId: string) {
    const response = await fetch(`/api/permissions/users/${userId}/groups/${groupId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.ok;
  }

  async assignCustomPermissionsToUser(userId: string, permissions: any[]) {
    const response = await fetch(`/api/permissions/users/${userId}/custom`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ permissions })
    });
    return response.json();
  }

  async revokeCustomPermissionFromUser(userId: string, permissionId: string) {
    const response = await fetch(`/api/permissions/users/${userId}/custom/${permissionId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.ok;
  }
}

export const permissionApiService = new PermissionApiService();