import { AppBar, Button, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'

const styles = {
  appBar: {
    flexShrink: 0,
    top: 'auto',
    bottom: 0,
    color: '#ffffff',
    backgroundColor: '#355992',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButton: {
    margin: '0.1em',
    padding: '0.1em',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
}
export default function Footer() {
  return (
    <AppBar position="fixed" sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <Typography>
          <Button
            sx={styles.footerButton}
            variant="contained"
            id="footer-home"
            target="_blank"
            href="https://www.gov.bc.ca/"
          >
            Home
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            id="footer-about"
            target="_blank"
            href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca"
          >
            About gov.bc.ca
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            id="footer-disclaimer"
            target="_blank"
            href="https://gov.bc.ca/disclaimer"
          >
            Disclaimer
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            id="footer-privacy"
            target="_blank"
            href="https://gov.bc.ca/privacy"
          >
            Privacy
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            id="footer-accessibility"
            target="_blank"
            href="https://gov.bc.ca/webaccessibility"
          >
            Accessibility
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            id="footer-copyright"
            target="_blank"
            href="https://gov.bc.ca/copyright"
          >
            Copyright
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            id="footer-contact"
            target="_blank"
            href="https://www2.gov.bc.ca/gov/content/home/contact-us"
          >
            Contact Us
          </Button>
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
