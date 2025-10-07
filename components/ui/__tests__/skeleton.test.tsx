import { render } from '@testing-library/react'
import { Skeleton } from '../skeleton'

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />)
    expect(container.firstChild).toHaveClass('h-10', 'w-full')
  })

  it('renders as a div by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })
})
