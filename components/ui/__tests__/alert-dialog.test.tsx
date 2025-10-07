import { render } from '@testing-library/react'
import * as Comp from '../alert-dialog'

describe('alert-dialog', () => {
  it('renders', () => {
    const { container } = render(<div>Test</div>)
    expect(container).toBeInTheDocument()
  })
})
