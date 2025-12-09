import { createRootRoute, ErrorComponent, Outlet } from '@tanstack/react-router'
// TEMPORARY: Using LayoutTest to isolate CSP violations
import LayoutTest from '@/components/LayoutTest'
// import Layout from '@/components/Layout'
import NotFound from '@/components/NotFound'

export const Route = createRootRoute({
  component: () => (
    <LayoutTest>
      <Outlet />
    </LayoutTest>
  ),
  notFoundComponent: () => <NotFound />,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
})
