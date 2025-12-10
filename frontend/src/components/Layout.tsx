import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Props = {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header title="QuickStart OpenShift">
        <Link to="/">
          <button type="button" className="btn btn-light btn-lg">
            <i className="bi bi-house-door-fill" />
          </button>
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
