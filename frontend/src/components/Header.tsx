import type { FC, ReactNode } from 'react'
import logo from '@/assets/BCID_H_rgb_pos.png'

type HeaderProps = {
  title: string
  children?: ReactNode
}

const Header: FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="bcgov-header">
      <div className="container-fluid">
        <div className="row align-items-center bcgov-header-row">
          <div className="col-auto bcgov-header-logo">
            <img src={logo} alt="British Columbia" height="40" />
          </div>
          <div className="col-auto bcgov-header-separator"></div>
          <div className="col bcgov-header-title-container">
            <h1 className="bcgov-header-title">{title}</h1>
          </div>
          {children && <div className="col-auto">{children}</div>}
        </div>
      </div>
      <div className="bcgov-header-banner"></div>
    </header>
  )
}

export default Header
