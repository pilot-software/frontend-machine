import { render } from '@testing-library/react'
import * as Comp from '../context-menu'

describe('context-menu', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
