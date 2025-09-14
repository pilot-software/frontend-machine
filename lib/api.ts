interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  branchId?: string;
}

export class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: ApiOptions = {}) {
    const { method = 'GET', body, branchId } = options;
    
    // Use backend API URL
    const baseUrl = 'https://springboot-api.azurewebsites.net';
    // Single API call handles both cases
    const url = baseUrl + endpoint + (branchId && branchId !== 'all' ? `?branchId=${branchId}` : '');

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      }
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    
    if (response.status === 403) {
      throw new Error('Access denied to this branch');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Patient API
  async getPatients(branchId?: string) {
    return this.request('/api/patients', { branchId });
  }

  async createPatient(data: any, branchId?: string) {
    const payload = { ...data };
    // Only add branchId if provided (orgs without branches don't need it)
    if (branchId) {
      payload.branchId = branchId;
    }
    return this.request('/api/patients', {
      method: 'POST',
      body: payload
    });
  }

  // Appointment API
  async getAppointments(branchId?: string) {
    return this.request('/api/appointments', { branchId });
  }

  async createAppointment(data: any, branchId?: string) {
    const payload = { ...data };
    if (branchId) {
      payload.branchId = branchId;
    }
    return this.request('/api/appointments', {
      method: 'POST',
      body: payload
    });
  }

  // Dashboard API
  async getDashboardData(branchId?: string) {
    return this.request('/api/secure/dashboard/stats', { branchId });
  }

  async getPatientStats(branchId?: string) {
    return this.request('/api/secure/dashboard/patient-stats', { branchId });
  }

  async getFinancialStats(branchId?: string) {
    return this.request('/api/secure/dashboard/financial-stats', { branchId });
  }

  async getClinicalStats(branchId?: string) {
    return this.request('/api/secure/dashboard/clinical-stats', { branchId });
  }

  async getAppointmentStats(branchId?: string) {
    return this.request('/api/secure/dashboard/appointment-stats', { branchId });
  }

  async getAnalytics(branchId?: string) {
    return this.request('/api/secure/dashboard/analytics', { branchId });
  }

  // Branch Management API
  async getBranches() {
    return this.request('/api/secure/branches');
  }

  async getBranchDetails(branchId: string) {
    return this.request(`/api/secure/branches/${branchId}`);
  }

  async getBranchPermissions(branchId: string) {
    return this.request(`/api/secure/branches/${branchId}/permissions`);
  }
}

export const apiClient = new ApiClient();

// Simple API wrapper for services
export const api = {
  async get(endpoint: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://springboot-api.azurewebsites.net${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://springboot-api.azurewebsites.net${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://springboot-api.azurewebsites.net${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async delete(endpoint: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://springboot-api.azurewebsites.net${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    return response.json();
  }
};