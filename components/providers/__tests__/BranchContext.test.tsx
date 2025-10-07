import { render, screen } from '@testing-library/react'
import { BranchProvider, useBranch } from '../BranchContext'
import { AuthProvider } from '../AuthContext'

jest.mock('@/lib/services/storage.service')
jest.mock('@/lib/services/auth')
jest.mock('@/lib/services/permission')
jest.mock('@/lib/api/client')
jest.mock('@/lib/api')

const TestComponent = () => {
  const { selectedBranch } = useBranch()
  return <div>{selectedBranch || 'No branch'}</div>
}

describe('BranchContext', () => {
  it('provides branch context', () => {
    render(
      <AuthProvider>
        <BranchProvider>
          <TestComponent />
        </BranchProvider>
      </AuthProvider>
    )
    expect(screen.getByText(/all|branch/i)).toBeInTheDocument()
  })

  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    expect(() => render(<TestComponent />)).toThrow()
    consoleError.mockRestore()
  })
})
