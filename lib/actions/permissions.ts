'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const PERMISSION_SERVICE_URL = process.env.PERMISSION_SERVICE_URL || 'http://localhost:8080';

async function getAuthHeader(): Promise<string> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    return token ? `Bearer ${token}` : '';
}

async function permissionFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const auth = await getAuthHeader();
    const res = await fetch(`${PERMISSION_SERVICE_URL}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', Authorization: auth, ...options.headers },
    });
    if (!res.ok) throw new Error(`Permission API ${res.status}: ${path}`);
    return res.json();
}

export async function getPermissionCatalog() {
    return permissionFetch('/api/permissions/catalog');
}

export async function createPermission(data: Record<string, unknown>) {
    const result = await permissionFetch('/api/permissions/catalog', { method: 'POST', body: JSON.stringify(data) });
    revalidateTag('permissions');
    return result;
}

export async function deletePermission(id: string) {
    const result = await permissionFetch(`/api/permissions/catalog/${id}`, { method: 'DELETE' });
    revalidateTag('permissions');
    return result;
}

export async function distributePermission(id: string, data: Record<string, unknown>) {
    const result = await permissionFetch(`/api/permissions/catalog/${id}/distribute`, { method: 'POST', body: JSON.stringify(data) });
    revalidateTag('permissions');
    return result;
}

export async function getPermissionGroups() {
    return permissionFetch('/api/permissions/groups');
}

export async function createPermissionGroup(data: Record<string, unknown>) {
    const result = await permissionFetch('/api/permissions/groups', { method: 'POST', body: JSON.stringify(data) });
    revalidateTag('permissions');
    return result;
}

export async function updatePermissionGroup(id: string, data: Record<string, unknown>) {
    const result = await permissionFetch(`/api/permissions/groups/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    revalidateTag('permissions');
    return result;
}

export async function deletePermissionGroup(id: string) {
    const result = await permissionFetch(`/api/permissions/groups/${id}`, { method: 'DELETE' });
    revalidateTag('permissions');
    return result;
}

export async function getUserPermissions(userId: string) {
    return permissionFetch(`/api/permissions/users/${userId}`);
}

export async function assignGroupToUser(userId: string, groupId: string) {
    const result = await permissionFetch(`/api/permissions/users/${userId}/groups/${groupId}`, { method: 'POST' });
    revalidateTag('permissions');
    return result;
}

export async function removeGroupFromUser(userId: string, groupId: string) {
    const result = await permissionFetch(`/api/permissions/users/${userId}/groups/${groupId}`, { method: 'DELETE' });
    revalidateTag('permissions');
    return result;
}

export async function addCustomPermission(userId: string, data: Record<string, unknown>) {
    const result = await permissionFetch(`/api/permissions/users/${userId}/custom`, { method: 'POST', body: JSON.stringify(data) });
    revalidateTag('permissions');
    return result;
}

export async function removeCustomPermission(userId: string, permissionId: string) {
    const result = await permissionFetch(`/api/permissions/users/${userId}/custom/${permissionId}`, { method: 'DELETE' });
    revalidateTag('permissions');
    return result;
}

export async function getOrganizationPermissions() {
    return permissionFetch('/api/permissions/organization/permissions');
}

export async function toggleOrganizationPermission(id: string) {
    const result = await permissionFetch(`/api/permissions/organization/permissions/${id}/toggle`, { method: 'POST' });
    revalidateTag('permissions');
    return result;
}

export async function assignOrganizationPermission(id: string, data: Record<string, unknown>) {
    const result = await permissionFetch(`/api/permissions/organization/permissions/${id}/assign`, { method: 'POST', body: JSON.stringify(data) });
    revalidateTag('permissions');
    return result;
}
