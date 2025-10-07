import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../checkbox'

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('handles checked state', async () => {
    const handleChange = jest.fn()
    render(<Checkbox onCheckedChange={handleChange} />)
    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    render(<Checkbox disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Checkbox className="custom" />)
    expect(screen.getByRole('checkbox')).toHaveClass('custom')
  })

  it('supports controlled checked state', () => {
    const { rerender } = render(<Checkbox checked={false} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    
    rerender(<Checkbox checked={true} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
