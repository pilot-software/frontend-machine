import { render, screen } from '@testing-library/react'
import { DashboardTabs } from '../DashboardTabs'

describe('DashboardTabs', () => {
  it('renders tabs', () => {
    const { container } = render(<DashboardTabs />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
