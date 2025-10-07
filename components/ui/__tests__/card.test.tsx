import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card'

describe('Card Components', () => {
  it('renders Card with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders CardHeader with title and description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders CardContent', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders CardFooter', () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom">Content</Card>)
    expect(container.firstChild).toHaveClass('custom')
  })
})
