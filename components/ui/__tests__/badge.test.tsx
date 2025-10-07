import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="destructive">Error</Badge>)
    expect(screen.getByText('Error')).toBeInTheDocument()
    
    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toBeInTheDocument()
    
    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge className="custom">Badge</Badge>)
    expect(screen.getByText('Badge')).toHaveClass('custom')
  })
})
