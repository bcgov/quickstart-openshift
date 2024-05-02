import BCGovLogo from '@/assets/BCID_H_rgb_pos.png'
import { AppBar, IconButton, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import { HomeRounded } from '@mui/icons-material'

const styles = {
  appBar: {
    color: '#ffffff',
    backgroundColor: '#ffffff',
    borderBottom: '0.1em solid rgb(252, 186, 25) !important',
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
    color: '#ffffff',
    backgroundColor: '#ffffff',
  },
}
export default function Header() {
  return (
    <AppBar position="fixed" sx={styles.appBar}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <img style={{ maxHeight: '60px' }} alt="Logo" src={BCGovLogo} />
        <div style={{ display: 'inline-flex' }}>
          <Typography
            sx={{
              display: 'inline-flex',
              fontFamily: 'BCSans',
              fontSize: {
                xs: '1.25em',
                sm: '1.5em',
              },
              lineHeight: '100%',
              alignItems: 'center',
              marginLeft: {
                xs: '.25em',
                sm: '.5em',
              },
              color: 'rgb(0 0 0 / 87%)'
            }}
          >
            QuickStart OpenShift
          </Typography>
        </div>
        <a href={'/'} target={'_self'}>
          <IconButton color="secondary">
            <HomeRounded color="secondary"></HomeRounded>
          </IconButton>
        </a>
      </Toolbar>
    </AppBar>
  )
}
