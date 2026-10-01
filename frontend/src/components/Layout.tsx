import type { FC } from 'react'
import { Footer, Header } from '@bcgov/design-system-react-components'
import { Link } from '@tanstack/react-router'

type Props = {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header title="QuickStart OpenShift" titleElement="h1">
        {' '}
        <Link aria-label="Dashboard" className="btn btn-light btn-lg" to="/">
          <i aria-hidden="true" className="bi bi-house-door-fill" />
        </Link>
      </Header>
      <main
        className="d-flex flex-grow-1 align-items-start justify-content-center mt-5 mb-5 ml-1 mr-1"
        id="main-content"
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
