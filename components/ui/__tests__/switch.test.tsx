import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '../switch'

describe('Switch', () => {
  it('renders switch', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('handles toggle', async () => {
    const handleChange = jest.fn()
    render(<Switch onCheckedChange={handleChange} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be disabled', () => {
    render(<Switch disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('supports controlled state', () => {
    const { rerender } = render(<Switch checked={false} />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked')
    
    rerender(<Switch checked={true} />)
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked')
  })
})
