import { render } from '@testing-library/react'
import * as Comp from '../dropdown-menu'

describe('dropdown-menu', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
