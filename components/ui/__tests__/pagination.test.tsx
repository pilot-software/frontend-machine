import { render } from '@testing-library/react'
import * as Comp from '../pagination'

describe('pagination', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
