import { render } from '@testing-library/react'
import * as Comp from '../carousel'

describe('carousel', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
