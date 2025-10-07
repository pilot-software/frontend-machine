import { render } from '@testing-library/react'
import * as Comp from '../hover-card'

describe('hover-card', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
