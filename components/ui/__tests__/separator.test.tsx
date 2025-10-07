import { render } from '@testing-library/react'
import { Separator } from '../separator'

describe('Separator', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('renders vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" />)
    expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical')
  })

  it('applies custom className', () => {
    const { container } = render(<Separator className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('is decorative by default', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveAttribute('data-orientation')
  })
})
