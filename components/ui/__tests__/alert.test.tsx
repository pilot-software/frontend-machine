import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '../alert'

describe('Alert', () => {
  it('renders alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed</AlertDescription>
      </Alert>
    )
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Operation completed')).toBeInTheDocument()
  })

  it('renders with default variant', () => {
    const { container } = render(<Alert>Default alert</Alert>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with destructive variant', () => {
    const { container } = render(<Alert variant="destructive">Error</Alert>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Alert className="custom">Alert</Alert>)
    expect(container.firstChild).toHaveClass('custom')
  })
})
