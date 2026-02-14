import { api } from '../api';

// Enums
export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ASSIGN = 'ASSIGN',
  UNASSIGN = 'UNASSIGN',
  PERMISSION_GRANT = 'PERMISSION_GRANT',
  PERMISSION_REVOKE = 'PERMISSION_REVOKE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  STATUS_CHANGE = 'STATUS_CHANGE'
}

export enum AuditEntityType {
  USER = 'USER',
  PATIENT = 'PATIENT',
  APPOINTMENT = 'APPOINTMENT',
  PRESCRIPTION = 'PRESCRIPTION',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  BILLING = 'BILLING',
  PAYMENT = 'PAYMENT',
  LAB_ORDER = 'LAB_ORDER',
  PERMISSION = 'PERMISSION',
  ROLE = 'ROLE',
  BRANCH = 'BRANCH',
  ORGANIZATION = 'ORGANIZATION',
  DEPARTMENT = 'DEPARTMENT',
  QUEUE = 'QUEUE'
}

export enum AuditOutcome {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  WARNING = 'WARNING',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS'
}

// DTOs matching backend
export interface AuditLogResponse {
  id: number;
  organizationId: string;
  userId: string;
  username: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  outcome: string;
  reason?: string;
  ipAddress: string;
  userAgent?: string;
  serviceName?: string;
  additionalContext?: string;
  timestamp: string;
  tamperDetected?: boolean;
}

export interface AuditLogRequest {
  organizationId: string;
  userId: string;
  username: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  outcome: string;
  reason?: string;
  ipAddress: string;
  userAgent?: string;
  serviceName?: string;
  additionalContext?: string;
}

export interface AuditSearchRequest {
  organizationId?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  outcome?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface AuditSearchResponse {
  content: AuditLogResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AuditStatistics {
  [action: string]: number;
}

export class AuditService {
  // Main API methods
  async createAuditLog(request: AuditLogRequest): Promise<AuditLogResponse> {
    return api.post('/api/audit/log', request);
  }

  async searchAuditLogs(request: AuditSearchRequest): Promise<AuditSearchResponse> {
    // Remove undefined/empty values
    const cleanRequest = Object.fromEntries(
      Object.entries(request).filter(([_, v]) => v !== undefined && v !== '')
    );
    return api.post('/api/audit/search', cleanRequest);
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLogResponse[]> {
    return api.get(`/api/audit/entity/${entityType}/${entityId}`);
  }

  async getStatistics(startDate: string): Promise<AuditStatistics> {
    return api.get(`/api/audit/statistics?startDate=${startDate}`);
  }

  async getSuspiciousActivities(startDate: string): Promise<AuditLogResponse[]> {
    return api.get(`/api/audit/suspicious?startDate=${startDate}`);
  }

  // Convenience methods
  async getRecentLogs(page: number = 0, size: number = 50): Promise<AuditSearchResponse> {
    return this.searchAuditLogs({ page, size });
  }

  async getUserLogs(userId: string, days: number = 30): Promise<AuditSearchResponse> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.searchAuditLogs({
      userId,
      startDate: startDate.toISOString(),
      page: 0,
      size: 100
    });
  }

  async getFailedActions(days: number = 7): Promise<AuditSearchResponse> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.searchAuditLogs({
      outcome: AuditOutcome.FAILURE,
      startDate: startDate.toISOString(),
      page: 0,
      size: 100
    });
  }

  async getActionLogs(action: AuditAction, days: number = 30): Promise<AuditSearchResponse> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.searchAuditLogs({
      action,
      startDate: startDate.toISOString(),
      page: 0,
      size: 100
    });
  }

  async getEntityTypeLogs(entityType: AuditEntityType, days: number = 30): Promise<AuditSearchResponse> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.searchAuditLogs({
      entityType,
      startDate: startDate.toISOString(),
      page: 0,
      size: 100
    });
  }

  // Helper to create audit log with current context
  async log(params: {
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string;
    outcome?: AuditOutcome;
    oldValue?: any;
    newValue?: any;
    reason?: string;
    additionalContext?: string;
  }): Promise<AuditLogResponse> {
    const user = this.getCurrentUser();
    const ipAddress = await this.getClientIP();

    return this.createAuditLog({
      organizationId: user.organizationId,
      userId: user.userId,
      username: user.username,
      userRole: user.role,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      oldValue: params.oldValue ? JSON.stringify(params.oldValue) : undefined,
      newValue: params.newValue ? JSON.stringify(params.newValue) : undefined,
      outcome: params.outcome || AuditOutcome.SUCCESS,
      reason: params.reason,
      ipAddress,
      userAgent: navigator.userAgent,
      serviceName: 'frontend',
      additionalContext: params.additionalContext
    });
  }

  // Export functionality
  async exportLogs(request: AuditSearchRequest, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const response = await this.searchAuditLogs({ ...request, size: 10000 });
    
    if (format === 'csv') {
      return this.convertToCSV(response.content);
    }
    
    return new Blob([JSON.stringify(response.content, null, 2)], { type: 'application/json' });
  }

  private convertToCSV(logs: AuditLogResponse[]): Blob {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Outcome', 'IP Address'];
    const rows = logs.map(log => [
      log.id,
      log.timestamp,
      log.username,
      log.userRole,
      log.action,
      log.entityType,
      log.entityId,
      log.outcome,
      log.ipAddress
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new Blob([csv], { type: 'text/csv' });
  }

  private getCurrentUser() {
    const userStr = localStorage.getItem('healthcare_user');
    if (!userStr) throw new Error('User not authenticated');
    const user = JSON.parse(userStr);
    return {
      userId: user.id,
      username: user.email || user.name,
      role: user.role,
      organizationId: 'hospital_org1' // TODO: Get from context
    };
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  }
}

export const auditService = new AuditService();
