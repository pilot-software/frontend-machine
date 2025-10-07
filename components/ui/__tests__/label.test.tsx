import { render, screen } from '@testing-library/react'
import { Label } from '../label'

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Email Address</Label>)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>
    )
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email')
  })

  it('applies custom className', () => {
    render(<Label className="custom">Label</Label>)
    expect(screen.getByText('Label')).toHaveClass('custom')
  })
})
