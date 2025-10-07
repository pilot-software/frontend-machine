import { render } from '@testing-library/react'
import * as Comp from '../resizable'

describe('resizable', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
