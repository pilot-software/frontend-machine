import { render, screen } from '@testing-library/react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../dialog'

describe('Dialog', () => {
  it('renders dialog components', () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
  })
})
