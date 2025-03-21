import { createRootRoute, ErrorComponent, Outlet } from '@tanstack/react-router'
import Layout from '@/components/layout'
import NotFound from '@/components/NotFound'

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: () => <NotFound />,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
})
