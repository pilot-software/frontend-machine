import { render } from '@testing-library/react'
import { Calendar } from '../calendar'

describe('Calendar', () => {
  it('renders calendar', () => {
    const { container } = render(<Calendar mode="single" />)
    expect(container.querySelector('[role="grid"]')).toBeInTheDocument()
  })
})
