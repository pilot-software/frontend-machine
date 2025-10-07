import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('accepts different types', () => {
    const { container, rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    
    rerender(<Input type="password" />)
    expect(container.querySelector('input')).toHaveAttribute('type', 'password')
  })

  it('applies custom className', () => {
    render(<Input className="custom" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom')
  })
})
