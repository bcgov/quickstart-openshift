import type { FC } from 'react'
import { Footer, Header } from '@bcgov/design-system-react-components'
import { Link } from '@tanstack/react-router'
import CSPCompliantButton from './CSPCompliantButton'

type Props = {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Test: Override default logo to diagnose CSP inline style violations */}
      {/* Setting logoImage to empty string to test if default logo causes inline styles */}
      <Header title={'QuickStart OpenShift'} logoImage="">
        {' '}
        <Link to="/">
          <CSPCompliantButton variant="light" size="lg">
            <i className="bi bi-house-door-fill" />
          </CSPCompliantButton>
        </Link>
      </Header>
      <div className="d-flex flex-grow-1 align-items-start justify-content-center mt-5 mb-5 ml-1 mr-1">
        {children}
      </div>
      {/* Test: Override default logo to diagnose CSP inline style violations */}
      {/* Setting logo to empty string to test if default logo causes inline styles */}
      <Footer logo="" />
    </div>
  )
}

export default Layout
