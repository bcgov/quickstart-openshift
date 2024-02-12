import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#385a8a',
    },
    error: {
      main: '#712024',
    },
    warning: {
      main: '#81692c',
    },
    success: {
      main: '#234720',
    },
  },
})

export default theme
