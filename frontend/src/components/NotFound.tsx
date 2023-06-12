import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router'

export default function NotFound() {
  const navigate = useNavigate()
  const buttonClicked = () => {
    navigate('/', { state: { data: undefined } }) // reset the state
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="md">
        <Grid>
          <Typography variant="h1">404</Typography>
          <Typography variant="h6">
            The page you’re looking for does not exist.
          </Typography>
          <Button
            name="homeBtn"
            id="homeBtn"
            onClick={() => buttonClicked()}
            variant="contained"
          >
            Back Home
          </Button>
        </Grid>
      </Container>
    </Box>
  )
}
