import { render } from '@testing-library/react'
import * as Comp from '../collapsible'

describe('collapsible', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
