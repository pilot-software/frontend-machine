import { render } from '@testing-library/react'
import * as Comp from '../menubar'

describe('menubar', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
