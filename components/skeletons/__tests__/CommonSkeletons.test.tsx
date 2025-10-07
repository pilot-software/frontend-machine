import { render } from '@testing-library/react'
import { CardSkeleton, AvatarSkeleton, StatsCardSkeleton, DashboardStatsSkeleton } from '../CommonSkeletons'

describe('CommonSkeletons', () => {
  describe('CardSkeleton', () => {
    it('renders card skeleton', () => {
      const { container } = render(<CardSkeleton />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('renders without header', () => {
      const { container } = render(<CardSkeleton showHeader={false} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('AvatarSkeleton', () => {
    it('renders avatar skeleton', () => {
      const { container } = render(<AvatarSkeleton />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('renders with different sizes', () => {
      const { container } = render(<AvatarSkeleton size="lg" />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('StatsCardSkeleton', () => {
    it('renders stats card skeleton', () => {
      const { container } = render(<StatsCardSkeleton />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })

  describe('DashboardStatsSkeleton', () => {
    it('renders dashboard stats skeleton', () => {
      const { container } = render(<DashboardStatsSkeleton />)
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(0)
    })
  })
})
