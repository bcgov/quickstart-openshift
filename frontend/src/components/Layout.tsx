import type { FC } from 'react'
import { Footer, Header } from '@bcgov/design-system-react-components'
import { Link } from '@tanstack/react-router'
import { Button } from 'react-bootstrap'

type Props = {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header title={'QuickStart OpenShift'}>
        {' '}
        <Link to="/">
          <Button variant="light" size="lg">
            <i className="bi bi-house-door-fill" />
          </Button>
        </Link>
      </Header>
      <div className="d-flex flex-grow-1 align-items-start justify-content-center mt-5 mb-5 ml-1 mr-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
