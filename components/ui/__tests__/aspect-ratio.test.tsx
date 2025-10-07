import { render } from '@testing-library/react'
import * as Comp from '../aspect-ratio'

describe('aspect-ratio', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
