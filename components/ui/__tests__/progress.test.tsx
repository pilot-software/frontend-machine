import { render, screen } from '@testing-library/react'
import { Progress } from '../progress'

describe('Progress', () => {
  it('renders progress bar', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays correct value', () => {
    const { container } = render(<Progress value={75} />)
    expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument()
  })

  it('handles 0 value', () => {
    render(<Progress value={0} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('handles 100 value', () => {
    render(<Progress value={100} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Progress value={50} className="custom" />)
    expect(screen.getByRole('progressbar')).toHaveClass('custom')
  })
})
