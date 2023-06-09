import BCGovLogo from '@/assets/gov-bc-logo-horiz.png'
import { AppBar, IconButton, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import { HomeRounded } from '@mui/icons-material'

export default function Header() {
  return (
    <AppBar position="fixed" style={{ flexShrink: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <img alt="Logo" src={BCGovLogo} />
        <Typography>Quickstart OpenShift</Typography>
        <a href={'/'} target={'_self'}>
          <IconButton style={{ backgroundColor: '#FFFFFF' }}>
            <HomeRounded color="primary"></HomeRounded>
          </IconButton>
        </a>
      </Toolbar>
    </AppBar>
  )
}
