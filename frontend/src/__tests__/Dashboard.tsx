import { render, screen } from '../test-utils'
import Dashboard from '@/components/Dashboard'

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<Dashboard />)
    expect(screen.getByText(/QuickStart OpenShift/i)).toBeInTheDocument()
  })
})
