import { render } from '@testing-library/react'
import * as Comp from '../breadcrumb'

describe('breadcrumb', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
