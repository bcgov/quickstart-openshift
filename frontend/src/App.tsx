import Box from '@mui/material/Box'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppRoutes from '@/routes'
import { BrowserRouter } from 'react-router-dom'

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
  },
}
export default function App() {
  return (
    <Box sx={styles.container}>
      <Header />
      <Box sx={styles.content}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Box>
      <Footer />
    </Box>
  )
}
