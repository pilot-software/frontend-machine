import { render, screen } from '@testing-library/react'
import { StoreProvider } from '../StoreProvider'

describe('StoreProvider', () => {
  it('renders children with store', () => {
    render(
      <StoreProvider>
        <div>Store Content</div>
      </StoreProvider>
    )
    expect(screen.getByText('Store Content')).toBeInTheDocument()
  })
})
