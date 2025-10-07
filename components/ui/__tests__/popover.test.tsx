import { render } from '@testing-library/react'
import { Popover, PopoverTrigger, PopoverContent } from '../popover'

describe('Popover', () => {
  it('renders popover', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )
    expect(container).toBeInTheDocument()
  })
})
