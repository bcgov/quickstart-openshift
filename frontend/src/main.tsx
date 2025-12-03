import '@bcgov/bc-sans/css/BC_Sans.css'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import bootstrap styles
import '@/scss/styles.scss'

// Import comprehensive style blocker - MUST be imported before React renders
import { blockAllInlineStyles } from '@/utils/react-style-interceptor'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Block all inline styles BEFORE React renders to prevent CSP violations
// This aggressively prevents inline styles from React Bootstrap, BCGov components, etc.
// Our CSS classes handle all necessary styling
blockAllInlineStyles()

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
