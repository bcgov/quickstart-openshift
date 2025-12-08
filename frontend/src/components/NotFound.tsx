import type { FC } from 'react'
import { useNavigate } from '@tanstack/react-router'
import CSPCompliantButton from './CSPCompliantButton'

const NotFound: FC = () => {
  const navigate = useNavigate()
  const buttonClicked = () => {
    navigate({
      to: '/',
    })
  }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>404</h1>
      <h6>The page you&apos;re looking for does not exist.</h6>
      <CSPCompliantButton
        name="homeBtn"
        id="homeBtn"
        onClick={() => buttonClicked()}
        variant="primary"
      >
        Back Home
      </CSPCompliantButton>
    </div>
  )
}

export default NotFound
