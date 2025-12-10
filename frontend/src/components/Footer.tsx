import type { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="bg-dark text-white mt-auto py-3">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>QuickStart OpenShift</strong>
            </p>
            <p className="small mb-0">Built for the Government of British Columbia</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="small mb-0">
              <a
                href="https://www2.gov.bc.ca/gov/content/home"
                className="text-white text-decoration-underline"
              >
                gov.bc.ca
              </a>
              {' | '}
              <a
                href="https://www2.gov.bc.ca/gov/content/home/disclaimer"
                className="text-white text-decoration-underline"
              >
                Disclaimer
              </a>
              {' | '}
              <a
                href="https://www2.gov.bc.ca/gov/content/home/privacy"
                className="text-white text-decoration-underline"
              >
                Privacy
              </a>
              {' | '}
              <a
                href="https://www2.gov.bc.ca/gov/content/home/accessible-government"
                className="text-white text-decoration-underline"
              >
                Accessibility
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

