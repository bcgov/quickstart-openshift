import type { FC, ReactNode } from 'react'
import logo from '@/assets/gov-bc-logo-horiz.png'

type HeaderProps = {
  title: string
  children?: ReactNode
}

const Header: FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="bg-primary text-white">
      <div className="container-fluid">
        <div className="row align-items-center py-2">
          <div className="col-auto">
            <img src={logo} alt="British Columbia" height="40" className="me-2" />
          </div>
          <div className="col">
            <h1 className="h5 mb-0">{title}</h1>
          </div>
          {children && <div className="col-auto">{children}</div>}
        </div>
      </div>
    </header>
  )
}

export default Header
