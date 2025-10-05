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
    return this.request("/patients", { branchId });
  }

  async createPatient(data: any, branchId?: string) {
    return this.request("/patients", {
      method: "POST",
      body: this.addBranchId(data, branchId),
    });
  }

  async updatePatient(id: string, data: any, branchId?: string) {
    return this.request(`/patients/${id}`, {
      method: "PUT",
      body: this.addBranchId(data, branchId),
    });
  }

  // Appointment API
  async getAppointments(branchId?: string) {
    return this.request("/appointments", { branchId });
  }

  async createAppointment(data: any, branchId?: string) {
    return this.request("/appointments", {
      method: "POST",
      body: this.addBranchId(data, branchId),
    });
  }

  // Dashboard API - Now uses role-based routing
  async getDashboardData(branchId?: string) {
    return this.request("/dashboard/stats", { branchId });
  }

  async getPatientStats(branchId?: string) {
    return this.request("/dashboard/patient-stats", { branchId });
  }

  async getFinancialStats(branchId?: string) {
    return this.request("/dashboard/financial-stats", { branchId });
  }

  async getClinicalStats(branchId?: string) {
    return this.request("/dashboard/clinical-stats", { branchId });
  }

  async getAppointmentStats(branchId?: string) {
    return this.request("/dashboard/appointment-stats", { branchId });
  }

  async getAnalytics(branchId?: string) {
    return this.request("/dashboard/analytics", { branchId });
  }

  // Branch Management API - Now uses ops routing
  async getBranches() {
    return this.request("/branches");
  }

  async getBranchDetails(branchId: string) {
    return this.request(`/branches/${branchId}`);
  }

  async getBranchPermissions(branchId: string) {
    return this.request(`/branches/${branchId}/permissions`);
  }

  // Queue Management API - NEW
  async getQueues() {
    return this.request("/queues");
  }

  async assignToQueue(queueData: any) {
    return this.request("/queues/assign", { method: "POST", body: queueData });
  }

  async updateQueueStatus(id: string, statusData: any) {
    return this.request(`/queues/${id}/status`, {
      method: "PUT",
      body: statusData,
    });
  }

  // User Management API - Uses consistent request method
  async getUsers() {
    return this.request("/users");
  }

  async getUsersByRole(role: string) {
    return this.request(`/users/role/${role}`);
  }

  async createUser(userData: any) {
    return this.request("/users", { method: "POST", body: userData });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, { method: "PUT", body: userData });
  }

  async getDoctors() {
    return this.request("/users/doctors");
  }

  async getDoctor(id: string) {
    return this.request(`/users/doctors/${id}`);
  }

  // Operations API endpoints
  async updateUserRole(id: string, role: string) {
    return this.request(`/users/${id}/role`, { method: "PUT", body: { role } });
  }

  async updateUserStatus(id: string, status: string) {
    return this.request(`/users/${id}/status`, {
      method: "PUT",
      body: { status },
    });
  }

  async getUserPermissions(userId: string) {
    return this.request(`/system/permissions/${userId}`);
  }

  async getSystemRoles() {
    return this.request("/system/roles");
  }

  async getSystemSettings() {
    return this.request("/system/settings");
  }

  // Permission Management API - NEW
  async getAllPermissions() {
    return this.request("/permissions/all");
  }

  async assignUserPermissions(userId: string, permissions: any) {
    return this.request(`/permissions/user/${userId}`, {
      method: "POST",
      body: permissions,
    });
  }

  async getRolePermissions(role: string) {
    return this.request(`/permissions/role/${role}`);
  }

  async updateRolePermissions(role: string, permissions: any) {
    return this.request(`/permissions/role/${role}`, {
      method: "PUT",
      body: permissions,
    });
  }

  async getPermissionGroups() {
    return this.request("/permissions/groups");
  }

  async createPermissionGroup(groupData: any) {
    return this.request("/permissions/groups", {
      method: "POST",
      body: groupData,
    });
  }

  async getBranchUserPermissions(branchId: string) {
    return this.request(`/permissions/branch/${branchId}/users`);
  }

  async assignBranchPermissions(
    branchId: string,
    userId: string,
    permissions: any
  ) {
    return this.request(`/permissions/branch/${branchId}/user/${userId}`, {
      method: "POST",
      body: permissions,
    });
  }

  // User Management Extended API
  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, { method: "DELETE" });
  }

  async getUserTemporaryRoles(userId: string) {
    return this.request(`/users/${userId}/temporary-roles`);
  }

  async grantTemporaryRole(userId: string, roleData: any) {
    return this.request(`/users/${userId}/temporary-roles`, {
      method: "POST",
      body: roleData,
    });
  }

  async revokeTemporaryRole(userId: string, roleId: string) {
    return this.request(`/users/${userId}/temporary-roles/${roleId}/revoke`, {
      method: "PUT",
      body: {},
    });
  }

  async getUserAuditLog(userId: string) {
    return this.request(`/users/${userId}/audit`);
  }

  async getPermissionAuditLog() {
    return this.request("/permissions/audit");
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
    const { method = "GET", body, branchId, userRole } = options;
    const role = userRole || this.getUserRole();

    // Use environment-based API URL
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_PROD_API_URL?.replace("/api", "") ||
          "https://springboot-api.azurewebsites.net"
        : process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
          "http://localhost:8080";

    // Use new routing logic
    const routedEndpoint = getEndpoint(role, endpoint);
    const url =
      baseUrl +
      routedEndpoint +
      (branchId && branchId !== "all" ? `?branchId=${branchId}` : "");

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

// Get base URL based on environment
const getBaseUrl = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_API_URL?.replace("/api", "") ||
        "https://springboot-api.azurewebsites.net"
    : process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
        "http://localhost:8080";
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
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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
    this.get(`/api/users/${userId}/permissions/effective`);
  assignUserPermissions = (userId: string, permissions: any) =>
    this.post(`/api/users/${userId}/permissions/override`, permissions);
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
