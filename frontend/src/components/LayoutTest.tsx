import type { FC } from 'react'
// TEMPORARY: Commented out to test if BCGov components cause CSP violations
// import { Footer, Header } from '@bcgov/design-system-react-components'
import { Link } from '@tanstack/react-router'

type Props = {
  children: React.ReactNode
}

const LayoutTest: FC<Props> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* TEMPORARY: Simplified header to test CSP violations */}
      <header className="bg-dark text-white p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h5 mb-0">QuickStart OpenShift (Test Mode - No BCGov Components)</h1>
          <Link to="/">
            <button type="button" className="btn btn-light btn-sm">
              <i className="bi bi-house-door-fill" />
            </button>
          </Link>
        </div>
      </header>
      <div className="d-flex flex-grow-1 align-items-start justify-content-center mt-5 mb-5 ml-1 mr-1">
        {children}
      </div>
      {/* TEMPORARY: Simplified footer */}
      <footer className="bg-dark text-white p-3 text-center">
        <small>Test Footer - BCGov components removed</small>
      </footer>
    </div>
  )
}

export default LayoutTest

