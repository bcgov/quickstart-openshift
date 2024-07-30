import Box from '@mui/material/Box'
import AppRoutes from '@/routes'
import { BrowserRouter } from 'react-router-dom'
import {
  Footer,
  Header,
} from "@bcgov/design-system-react-components";
import { IconButton } from '~/@mui/material'
import { HomeRounded } from '~/@mui/icons-material'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flexGrow: 1,
    marginTop: '5em',
    marginRight: '1em',
    marginLeft: '1em',
    marginBottom: '5em',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
}
export default function App() {
  return (
    <Box sx={styles.container}>
      <Header title={'QuickStart OpenShift'}> <a href={'/'} target={'_self'}>
        <IconButton color="secondary">
          <HomeRounded color="secondary"></HomeRounded>
        </IconButton>
      </a></Header>
      <Box sx={styles.content}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Box>
      <Footer />
    </Box>
  )
}
