import { render } from '@testing-library/react'
import { Slider } from '../slider'

describe('Slider', () => {
  it('renders', () => {
    const { container } = render(<Slider defaultValue={[50]} max={100} step={1} />)
    expect(container).toBeInTheDocument()
  })
})
