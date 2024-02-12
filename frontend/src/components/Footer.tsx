import { AppBar, Button, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'

const styles = {
  appBar: {
    flexShrink: 0,
    top: 'auto',
    bottom: 0,
    color: '#ffffff',
    backgroundColor: '#ffffff',
    display: 'flex',
    zIndex: (theme: any) => theme.zIndex.drawer + 1,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButton: {
    margin: '0.2em',
    padding: '0.2em',
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
            color="secondary"
            id="footer-home"
            target="_blank"
            href="https://www.gov.bc.ca/"
          >
            Home
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            color="secondary"
            id="footer-about"
            target="_blank"
            href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca"
          >
            About gov.bc.ca
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            color="secondary"
            id="footer-disclaimer"
            target="_blank"
            href="https://gov.bc.ca/disclaimer"
          >
            Disclaimer
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            color="secondary"
            id="footer-privacy"
            target="_blank"
            href="https://gov.bc.ca/privacy"
          >
            Privacy
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            color="secondary"
            id="footer-accessibility"
            target="_blank"
            href="https://gov.bc.ca/webaccessibility"
          >
            Accessibility
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            color="secondary"
            id="footer-copyright"
            target="_blank"
            href="https://gov.bc.ca/copyright"
          >
            Copyright
          </Button>
          <Button
            sx={styles.footerButton}
            variant="contained"
            color="secondary"
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
