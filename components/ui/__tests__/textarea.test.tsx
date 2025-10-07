import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '../textarea'

describe('Textarea', () => {
  it('renders textarea', () => {
    render(<Textarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'test')
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Textarea className="custom" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom')
  })

  it('supports rows attribute', () => {
    render(<Textarea rows={5} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5')
  })
})
