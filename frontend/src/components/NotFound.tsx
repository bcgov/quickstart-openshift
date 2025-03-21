import type { FC } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from '@tanstack/react-router'

// sx={{
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   minHeight: '100vh',
// }}

const NotFound: FC = () => {
  const navigate = useNavigate()
  const buttonClicked = () => {
    navigate({
      to: '/',
    })
  }
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1>404</h1>
            <h6>The page you’re looking for does not exist.</h6>
            <Button
              name="homeBtn"
              id="homeBtn"
              onClick={() => buttonClicked()}
              variant="contained"
            >
              Back Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default NotFound
