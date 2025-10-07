import { render } from '@testing-library/react'
import * as Comp from '../scroll-area'

describe('scroll-area', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
