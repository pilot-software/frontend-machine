import { getEndpoint, handleApiResponse, UserRole } from "./utils/api-router";

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  branchId?: string;
  userRole?: UserRole;
}

export class ApiClient {
  private token: string | null = null;
  private userRole: UserRole | null = null;

  setToken(token: string) {
    this.token = token;
  }

  setUserRole(role: UserRole) {
    this.userRole = role;
  }

  // Patient API
  async getPatients(branchId?: string) {
    return this.request("/api/patients", { branchId });
  }

  async createPatient(data: any, branchId?: string) {
    return this.request("/api/patients", {
      method: "POST",
      body: this.addBranchId(data, branchId),
    });
  }

  async updatePatient(id: string, data: any, branchId?: string) {
    return this.request(`/api/patients/${id}`, {
      method: "PUT",
      body: this.addBranchId(data, branchId),
    });
  }

  async getAppointments(branchId?: string) {
    return this.request("/api/appointments", { branchId });
  }

  async createAppointment(data: any, branchId?: string) {
    return this.request("/api/appointments", {
      method: "POST",
      body: this.addBranchId(data, branchId),
    });
  }

  async getDashboardData(branchId?: string) {
    return this.request("/api/ops/dashboard/stats", { branchId });
  }

  async getPatientStats(branchId?: string) {
    return this.request("/api/ops/dashboard/patient-stats", { branchId });
  }

  async getFinancialStats(branchId?: string) {
    return this.request("/api/ops/dashboard/financial-stats", { branchId });
  }

  async getClinicalStats(branchId?: string) {
    return this.request("/api/ops/dashboard/clinical-stats", { branchId });
  }

  async getAppointmentStats(branchId?: string) {
    return this.request("/api/ops/dashboard/appointment-stats", { branchId });
  }

  async getAnalytics(branchId?: string) {
    return this.request("/api/ops/dashboard/analytics", { branchId });
  }

  async getBranches() {
    return this.request("/api/ops/branches");
  }

  async getBranchDetails(branchId: string) {
    return this.request(`/api/ops/branches/${branchId}`);
  }

  async getBranchPermissions(branchId: string) {
    return this.request(`/api/ops/branches/${branchId}/permissions`);
  }

  async getQueues() {
    return this.request("/api/queues");
  }

  async assignToQueue(queueData: any) {
    return this.request("/api/queues/assign", { method: "POST", body: queueData });
  }

  async updateQueueStatus(id: string, statusData: any) {
    return this.request(`/api/queues/${id}/status`, {
      method: "PUT",
      body: statusData,
    });
  }

  async getUsers() {
    return this.request("/api/users");
  }

  async getUsersByRole(role: string) {
    return this.request(`/api/users/role/${role}`);
  }

  async createUser(userData: any) {
    return this.request("/api/users", { method: "POST", body: userData });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/api/users/${id}`, { method: "PUT", body: userData });
  }

  async getDoctors() {
    return this.request("/api/users/doctors");
  }

  async getDoctor(id: string) {
    return this.request(`/api/users/doctors/${id}`);
  }

  async updateUserRole(id: string, role: string) {
    return this.request(`/api/users/${id}/role`, { method: "PUT", body: { role } });
  }

  async updateUserStatus(id: string, status: string) {
    return this.request(`/api/users/${id}/status`, {
      method: "PUT",
      body: { status },
    });
  }

  async getUserPermissions(userId: string) {
    return this.request(`/api/system/permissions/${userId}`);
  }

  async getSystemRoles() {
    return this.request("/api/system/roles");
  }

  async getSystemSettings() {
    return this.request("/api/system/settings");
  }

  async getAllPermissions() {
    return this.request("/api/permissions/all");
  }

  async assignUserPermissions(userId: string, permissions: any) {
    return this.request(`/api/permissions/user/${userId}`, {
      method: "POST",
      body: permissions,
    });
  }

  async getRolePermissions(role: string) {
    return this.request(`/api/permissions/role/${role}`);
  }

  async updateRolePermissions(role: string, permissions: any) {
    return this.request(`/api/permissions/role/${role}`, {
      method: "PUT",
      body: permissions,
    });
  }

  async getPermissionGroups() {
    return this.request("/api/permissions/groups");
  }

  async createPermissionGroup(groupData: any) {
    return this.request("/api/permissions/groups", {
      method: "POST",
      body: groupData,
    });
  }

  async getBranchUserPermissions(branchId: string) {
    return this.request(`/api/permissions/branch/${branchId}/users`);
  }

  async assignBranchPermissions(
    branchId: string,
    userId: string,
    permissions: any
  ) {
    return this.request(`/api/permissions/branch/${branchId}/user/${userId}`, {
      method: "POST",
      body: permissions,
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/api/users/${userId}`, { method: "DELETE" });
  }

  async getUserTemporaryRoles(userId: string) {
    return this.request(`/api/users/${userId}/temporary-roles`);
  }

  async grantTemporaryRole(userId: string, roleData: any) {
    return this.request(`/api/users/${userId}/temporary-roles`, {
      method: "POST",
      body: roleData,
    });
  }

  async revokeTemporaryRole(userId: string, roleId: string) {
    return this.request(`/api/users/${userId}/temporary-roles/${roleId}/revoke`, {
      method: "PUT",
      body: {},
    });
  }

  async getUserAuditLog(userId: string) {
    return this.request(`/api/users/${userId}/audit`);
  }

  async getPermissionAuditLog() {
    return this.request("/api/permissions/audit");
  }

  private addBranchId(data: any, branchId?: string) {
    const payload = { ...data };
    if (branchId) {
      payload.branchId = branchId;
    }
    return payload;
  }

  private getUserRole(): UserRole {
    if (this.userRole) return this.userRole;

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("healthcare_user");
      if (user) {
        const userData = JSON.parse(user);
        return userData.role?.toUpperCase() || "PATIENT";
      }
    }
    return "PATIENT";
  }

  private async request(endpoint: string, options: ApiOptions = {}) {
    const { method = "GET", body, branchId } = options;

    const baseUrl = getBaseUrl();
    const url = baseUrl + endpoint + (branchId && branchId !== "all" ? `?branchId=${branchId}` : "");

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    return handleApiResponse(response);
  }
}

export const apiClient = new ApiClient();

// Get base URL - always use direct backend
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

class SimpleApi {
  get = (endpoint: string) => this.makeRequest(endpoint);

  post = (endpoint: string, data: any) =>
    this.makeRequest(endpoint, "POST", data);

  put = (endpoint: string, data: any) =>
    this.makeRequest(endpoint, "PUT", data);

  delete = (endpoint: string) => this.makeRequest(endpoint, "DELETE");

  private async makeRequest(
    endpoint: string,
    method: string = "GET",
    data?: any
  ) {
    if (typeof window === "undefined") {
      throw new Error("API calls must be made from client side");
    }
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("healthcare_user");
    const userData = user ? JSON.parse(user) : null;
    const organizationId = userData?.organizationId;
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(organizationId && { "X-Organization-ID": organizationId }),
      },
      ...(data && { body: JSON.stringify(data) }),
    });
    
    return handleApiResponse(response);
  }
}

// Extended API methods for user management
class ExtendedApi extends SimpleApi {
  deleteUser = (userId: string) => this.delete(`/api/users/${userId}`);
  getUserTemporaryRoles = (userId: string) =>
    this.get(`/api/permissions/temporary/active/${userId}`);
  grantTemporaryRole = (userId: string, permissionData: any) =>
    this.post(`/api/permissions/temporary/grant/${userId}`, permissionData);
  revokeTemporaryRole = (userId: string, permission: string) =>
    this.delete(`/api/permissions/temporary/revoke/${userId}/${permission}`);
  getUserAuditLog = (userId: string) =>
    this.get(`/api/users/${userId}/permissions/audit`);
  getPermissionAuditLog = () => this.get("/api/permissions/audit");
  getUserPermissions = (userId: string) =>
    this.get(`/api/permissions/user/${userId}`);
  assignUserPermissions = (userId: string, permissions: any) =>
    this.put(`/api/permissions/user/${userId}`, permissions);
  getRolePermissions = (role: string) =>
    this.get(`/api/permissions/role/${role}`);
  updateRolePermissions = (role: string, permissions: any) =>
    this.put(`/api/permissions/role/${role}`, permissions);
  getPermissionGroups = () => this.get("/api/permissions/groups");
  createPermissionGroup = (groupData: any) =>
    this.post("/api/permissions/groups", groupData);
  getBranchUserPermissions = (branchId: string) =>
    this.get(`/api/permissions/branch/${branchId}/users`);
  assignBranchPermissions = (
    branchId: string,
    userId: string,
    permissions: any
  ) =>
    this.post(
      `/api/permissions/branch/${branchId}/user/${userId}`,
      permissions
    );
}

export const api = new ExtendedApi();
