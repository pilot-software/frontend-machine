import { render } from '@testing-library/react'
import { DashboardSkeleton } from '../DashboardSkeleton'

describe('DashboardSkeleton', () => {
  it('renders skeleton structure', () => {
    const { container } = render(<DashboardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders multiple skeleton cards', () => {
    const { container } = render(<DashboardSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders with proper grid layout', () => {
    const { container } = render(<DashboardSkeleton />)
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })
})
