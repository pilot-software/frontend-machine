import { authService } from '../auth'

global.fetch = jest.fn()

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('login makes API call', async () => {
    const mockResponse = { token: 'test-token', id: '1', email: 'test@test.com', role: 'ADMIN' as const }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse)
    })

    const result = await authService.login({
      email: 'test@test.com',
      password: 'password',
      organizationId: 'org1'
    })

    expect(result).toEqual(mockResponse)
  })

  it('logout clears session', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Logged out' })
    })
    const result = await authService.logout()
    expect(result.message).toBe('Logged out')
  })
})
