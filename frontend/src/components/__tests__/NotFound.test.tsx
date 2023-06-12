import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '@/components/NotFound'

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}))

describe('NotFound', () => {
  test('renders a heading with the correct text', () => {
    const navigate = vi.fn()
    const useNavigateMock = vi.fn(() => navigate)
    vi.doMock('react-router', () => ({
      useNavigate: useNavigateMock,
    }))
    render(<NotFound />)
    const headingElement = screen.getByRole('heading', { name: /404/i })
    expect(headingElement).toBeInTheDocument()
  })
})
