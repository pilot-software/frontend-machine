import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '../avatar'

describe('Avatar', () => {
  it('renders avatar with image', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/test.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('shows fallback when image fails', () => {
    render(
      <Avatar>
        <AvatarImage src="/invalid.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders fallback only', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('applies custom className to avatar', () => {
    const { container } = render(
      <Avatar className="custom">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(container.firstChild).toHaveClass('custom')
  })
})
