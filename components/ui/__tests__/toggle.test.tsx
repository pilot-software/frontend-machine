import { render } from '@testing-library/react'
import * as Comp from '../toggle'

describe('toggle', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
