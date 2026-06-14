import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotFound from '@/components/NotFound'

const navigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
}))

describe('NotFound', () => {
  beforeEach(() => {
    navigate.mockClear()
  })

  test('renders a heading with the correct text', () => {
    render(<NotFound />)
    const headingElement = screen.getByRole('heading', { name: /404/i })
    expect(headingElement).toBeInTheDocument()
  })

  test('navigates home when the Back Home button is clicked', async () => {
    const user = userEvent.setup()
    render(<NotFound />)
    await user.click(screen.getByRole('button', { name: /back home/i }))
    expect(navigate).toHaveBeenCalledWith({ to: '/' })
  })
})
