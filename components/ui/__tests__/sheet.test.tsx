import { render } from '@testing-library/react'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '../sheet'

describe('Sheet', () => {
  it('renders sheet', () => {
    const { container } = render(
      <Sheet open={true}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
    expect(container).toBeInTheDocument()
  })
})
