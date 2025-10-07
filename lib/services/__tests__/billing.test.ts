import { billingService } from '../billing'

global.fetch = jest.fn()

describe('billingService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getBillingRecords fetches billing data', async () => {
    const mockBilling = [{
      id: '1',
      patientId: 'pat1',
      amount: 100,
      amountPaid: 50,
      amountDue: 50,
      status: 'PARTIAL' as const,
      serviceDescription: 'Consultation',
      billingDate: '2024-01-01',
      dueDate: '2024-01-15',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockBilling)
    })

    const result = await billingService.getBillingRecords()
    expect(result).toEqual(mockBilling)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/billing')
  })

  it('createBillingRecord creates new billing record', async () => {
    const newBilling = {
      patientId: 'pat1',
      amount: 200,
      amountPaid: 0,
      amountDue: 200,
      status: 'PENDING' as const,
      serviceDescription: 'Surgery',
      billingDate: '2024-01-01',
      dueDate: '2024-01-30'
    }
    const createdBilling = { id: '2', ...newBilling, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
    
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(createdBilling)
    })

    const result = await billingService.createBillingRecord(newBilling)
    expect(result).toEqual(createdBilling)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBilling)
    })
  })
})
