import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Layout from '@/components/Layout'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: ReactNode
    to: string
  } & AnchorHTMLAttributes<HTMLAnchorElement>): ReactElement => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('Layout', () => {
  test('exposes one main landmark, a level-one heading, and a named home control', () => {
    render(
      <Layout>
        <p>Page content</p>
      </Layout>,
    )

    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('main')).toContainElement(screen.getByText('Page content'))
    expect(
      screen.getByRole('heading', { level: 1, name: 'QuickStart OpenShift' }),
    ).toBeInTheDocument()

    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/')
    expect(within(header).queryByRole('button')).not.toBeInTheDocument()
    expect(
      within(header).getByRole('link', { name: 'Government of British Columbia' }),
    ).toBeInTheDocument()
  })
})
