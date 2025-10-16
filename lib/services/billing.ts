export interface ApiBilling {
    id: string;
    patientId: string;
    visitId?: string;
    appointmentId?: string;
    amount: number;
    amountPaid: number;
    amountDue: number;
    status: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";
    serviceDescription: string;
    billingDate: string;
    dueDate: string;
    paymentDate?: string;
    paymentMethod?: string;
    createdAt: string;
    updatedAt: string;
}

export class BillingService {
    async getBillingRecords(): Promise<ApiBilling[]> {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/api/billing`);
        if (!response.ok) {
            throw new Error(`Failed to fetch billing records: ${response.status}`);
        }
        return response.json();
    }

    async createBillingRecord(billing: Omit<ApiBilling, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiBilling> {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/api/billing`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(billing)
        });
        if (!response.ok) {
            throw new Error(`Failed to create billing record: ${response.status}`);
        }
        return response.json();
    }
}

export const billingService = new BillingService();
