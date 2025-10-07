import { render } from '@testing-library/react'
import * as Comp from '../drawer'

describe('drawer', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
