import type { FC } from 'react'
import { useNavigate } from '@tanstack/react-router'

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
      <h6>The page you're looking for does not exist.</h6>
      <button
        type="button"
        name="homeBtn"
        id="homeBtn"
        onClick={() => buttonClicked()}
        className="btn btn-primary"
      >
        Back Home
      </button>
    </div>
  )
}

export default NotFound
