import { render } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from '../radio-group'

describe('RadioGroup', () => {
  it('renders', () => {
    const { container } = render(
      <RadioGroup>
        <RadioGroupItem value="1" />
      </RadioGroup>
    )
    expect(container).toBeInTheDocument()
  })
})
