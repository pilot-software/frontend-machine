import { render, screen } from '@testing-library/react'
import { Providers } from '../Providers'

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: any) => <div>{children}</div>
}))

describe('Providers', () => {
  it('renders children with all providers', () => {
    render(
      <Providers>
        <div>App Content</div>
      </Providers>
    )
    expect(screen.getByText('App Content')).toBeInTheDocument()
  })
})
