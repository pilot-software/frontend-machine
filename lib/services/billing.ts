import { api } from '../api';

export interface ServiceCatalog {
  id: string;
  organizationId: string;
  serviceCode: string;
  serviceName: string;
  category: 'CONSULTATION' | 'RADIOLOGY' | 'LAB' | 'PROCEDURE';
  basePrice: number;
  taxPercentage: number;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingItem {
  serviceId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  taxPercentage: number;
}

export interface CreateBillingRequest {
  patientId: string;
  appointmentId?: string;
  doctorId?: string;
  branchId?: string;
  description: string;
  discountPercentage?: number;
  discountReason?: string;
  items: BillingItem[];
}

export interface BillingResponse {
  id: number;
  billNumber: string;
  patientId: string;
  appointmentId?: string;
  doctorId?: string;
  branchId?: string;
  description: string;
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  discountReason?: string;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'CANCELLED';
  billDate: string;
  dueDate: string;
  items: BillingItemResponse[];
  createdAt: string;
}

export interface BillingItemResponse {
  id: number;
  serviceId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  taxPercentage: number;
  taxAmount: number;
  totalPrice: number;
}

export interface FinanceOverview {
  totalRevenue: number;
  totalCollected: number;
  totalPending: number;
  totalBills: number;
  paidBills: number;
  pendingBills: number;
}

export class BillingService {
  async getAllServices(): Promise<ServiceCatalog[]> {
    return api.get('/api/service-catalog');
  }

  async getServicesByCategory(category: string): Promise<ServiceCatalog[]> {
    return api.get(`/api/service-catalog/category/${category}`);
  }

  async getServiceById(id: string): Promise<ServiceCatalog> {
    return api.get(`/api/service-catalog/${id}`);
  }

  async createService(service: Partial<ServiceCatalog>): Promise<ServiceCatalog> {
    return api.post('/api/service-catalog', service);
  }

  async updateService(id: string, service: Partial<ServiceCatalog>): Promise<ServiceCatalog> {
    return api.put(`/api/service-catalog/${id}`, service);
  }

  async createBilling(request: CreateBillingRequest): Promise<BillingResponse> {
    return api.post('/api/billing', request);
  }

  async getBillingById(id: number): Promise<BillingResponse> {
    return api.get(`/api/billing/${id}`);
  }

  async getPatientBillings(patientId: string): Promise<BillingResponse[]> {
    return api.get(`/api/billing/patient/${patientId}`);
  }

  async getBillingRecords(): Promise<BillingResponse[]> {
    try {
      return await api.get('/api/billing');
    } catch (error) {
      return [];
    }
  }

  async getFinanceOverview(): Promise<FinanceOverview> {
    return api.get('/api/finance/overview');
  }
}

export const billingService = new BillingService();
