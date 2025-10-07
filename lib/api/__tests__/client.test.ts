import { ApiClient } from '../client'

global.fetch = jest.fn()

describe('ApiClient', () => {
  let client: ApiClient

  beforeEach(() => {
    jest.clearAllMocks()
    client = new ApiClient('http://test-api.com')
    localStorage.setItem('auth_token', 'test-token')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('sets token', () => {
    client.setToken('new-token')
    expect(client['token']).toBe('new-token')
  })

  it('get method fetches data', async () => {
    const mockData = { id: '1', name: 'Test' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData)
    })

    const result = await client.get('/test')
    expect(result).toEqual(mockData)
    expect(global.fetch).toHaveBeenCalledWith('http://test-api.com/test', expect.any(Object))
  })

  it('post method creates data', async () => {
    const newData = { name: 'New' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: '2', ...newData })
    })

    const result = await client.post('/test', newData)
    expect(result.name).toBe('New')
  })

  it('put method updates data', async () => {
    const updated = { name: 'Updated' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(updated)
    })

    const result = await client.put('/test/1', updated)
    expect(result.name).toBe('Updated')
  })

  it('delete method removes data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

    await client.delete('/test/1')
    expect(global.fetch).toHaveBeenCalled()
  })

  it('getPatients fetches patients', async () => {
    const mockPatients = [{ id: '1', firstName: 'John' }]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockPatients)
    })

    const result = await client.getPatients()
    expect(result).toEqual(mockPatients)
  })

  it('createPatient creates patient', async () => {
    const newPatient = { firstName: 'Jane' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: '2', ...newPatient })
    })

    const result = await client.createPatient(newPatient)
    expect(result.firstName).toBe('Jane')
  })

  it('updatePatient updates patient', async () => {
    const updated = { firstName: 'Updated' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(updated)
    })

    const result = await client.updatePatient('1', updated)
    expect(result.firstName).toBe('Updated')
  })

  it('getAppointments fetches appointments', async () => {
    const mockAppointments = [{ id: '1' }]
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockAppointments)
    })

    const result = await client.getAppointments()
    expect(result).toEqual(mockAppointments)
  })

  it('createAppointment creates appointment', async () => {
    const newAppt = { patientId: '1' }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: '2', ...newAppt })
    })

    const result = await client.createAppointment(newAppt)
    expect(result.patientId).toBe('1')
  })

  it('handles API errors in get', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValue('Not found')
    })

    await expect(client.get('/test')).rejects.toThrow('API Error')
  })

  it('handles API errors in delete', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server error')
    })

    await expect(client.delete('/test/1')).rejects.toThrow('API Error')
  })

  it('includes auth token in headers', async () => {
    client.setToken('my-token')
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({})
    })

    await client.get('/test')
    const callArgs = (global.fetch as jest.Mock).mock.calls[0]
    expect(callArgs[1].headers['Authorization']).toBe('Bearer my-token')
  })
})
