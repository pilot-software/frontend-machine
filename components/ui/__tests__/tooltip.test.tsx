import { render } from '@testing-library/react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../tooltip'

describe('Tooltip', () => {
  it('renders tooltip', () => {
    const { container } = render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(container).toBeInTheDocument()
  })
})
