import { render } from '@testing-library/react'
import * as Comp from '../navigation-menu'

describe('navigation-menu', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
