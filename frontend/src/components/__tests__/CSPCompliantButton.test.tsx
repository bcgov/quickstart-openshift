import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import CSPCompliantButton from '@/components/CSPCompliantButton'

describe('CSPCompliantButton', () => {
  test('renders button with children', () => {
    render(<CSPCompliantButton>Click me</CSPCompliantButton>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  test('applies default primary variant', () => {
    render(<CSPCompliantButton>Button</CSPCompliantButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn', 'btn-primary')
  })

  test('applies specified variant', () => {
    render(<CSPCompliantButton variant="secondary">Button</CSPCompliantButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn', 'btn-secondary')
  })

  test('applies size class', () => {
    render(<CSPCompliantButton size="sm">Button</CSPCompliantButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-sm')
  })

  test('applies custom className', () => {
    render(<CSPCompliantButton className="custom-class">Button</CSPCompliantButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  test('handles onClick events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<CSPCompliantButton onClick={handleClick}>Button</CSPCompliantButton>)
    const button = screen.getByRole('button')
    await user.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('passes through additional props', () => {
    render(<CSPCompliantButton type="submit" disabled data-testid="test-button">Button</CSPCompliantButton>)
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toBeDisabled()
  })

  test('supports all variant types', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link']
    variants.forEach((variant) => {
      const { container } = render(
        <CSPCompliantButton variant={variant as any}>Button</CSPCompliantButton>
      )
      expect(container.firstChild).toHaveClass(`btn-${variant}`)
    })
  })
})

