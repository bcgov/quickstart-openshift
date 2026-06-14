import { vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '@/components/Dashboard'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}))

describe('Dashboard', () => {
  test('renders a heading with the correct text', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Employee ID/i)).toBeInTheDocument()
  })

  test('opens and closes the row details modal', async () => {
    render(<Dashboard />)

    // Wait for the mocked user data to load and render the View Details button.
    const viewDetailsButton = await screen.findByRole('button', { name: /view details/i })
    await userEvent.click(viewDetailsButton)

    expect(screen.getByText(/Row Details/i)).toBeInTheDocument()

    const closeButtons = screen.getAllByRole('button', { name: 'Close' })
    await userEvent.click(closeButtons[closeButtons.length - 1])
    await waitFor(() => {
      expect(screen.queryByText(/Row Details/i)).not.toBeInTheDocument()
    })
  })
})
