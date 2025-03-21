import type { FC } from 'react'
import { Footer, Header } from '@bcgov/design-system-react-components'
//import { Container, Row, Col } from 'react-bootstrap'
import { Link } from '@tanstack/react-router'
import { Button } from 'react-bootstrap'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flexGrow: 1,
    marginTop: '5em',
    marginRight: '1em',
    marginLeft: '1em',
    marginBottom: '5em',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
}

type Props = {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div>
      <Header title={'QuickStart OpenShift'}>
        {' '}
        <Link to="/">
          <Button variant="primary" size="sm">
            Home
          </Button>
        </Link>
      </Header>
      <div>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
