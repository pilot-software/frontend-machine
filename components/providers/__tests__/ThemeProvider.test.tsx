import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../ThemeProvider'

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('provides theme context', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Theme Test</div>
      </ThemeProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
