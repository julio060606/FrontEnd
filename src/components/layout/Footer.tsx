import React, { FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { NavLink } from 'react-router-dom';

const quickLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Comparar', to: '/compare' },
  { label: 'Estado', to: '/status' },
  { label: 'Live Tracker', to: '/tracker' },
];

const supportLinks = [
  { label: 'Centro de Ayuda', href: '#ayuda' },
  { label: 'Términos y Condiciones', href: '#terminos' },
  { label: 'Políticas de Privacidad', href: '#privacidad' },
  { label: 'Libro de Reclamaciones', href: '#reclamaciones' },
];

const linkSx = {
  color: 'rgba(255, 255, 255, 0.72)',
  fontSize: '0.9rem',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '&:hover': { color: '#05BFDB' },
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1B2A4A',
        color: '#FFFFFF',
        pt: { xs: 6, md: 8 },
        pb: 3,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 5, md: 4 }}>
          <Grid item xs={12} md={3}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FlightTakeoffIcon sx={{ color: '#05BFDB', fontSize: 32 }} />
                <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
                  FlightTracker
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.7, maxWidth: 300 }}>
                Compara vuelos, encuentra las mejores rutas y sigue tu viaje en tiempo real.
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButton aria-label="Facebook" href="#facebook" sx={{ color: '#FFFFFF', '&:hover': { color: '#05BFDB' } }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton aria-label="Instagram" href="#instagram" sx={{ color: '#FFFFFF', '&:hover': { color: '#05BFDB' } }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton aria-label="Twitter" href="#twitter" sx={{ color: '#FFFFFF', '&:hover': { color: '#05BFDB' } }}>
                  <TwitterIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
              Links Rápidos
            </Typography>
            <Stack spacing={1.25}>
              {quickLinks.map((link) => (
                <Link key={link.label} component={NavLink} to={link.to} sx={linkSx}>
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
              Legal &amp; Soporte
            </Typography>
            <Stack spacing={1.25}>
              {supportLinks.map((link) => (
                <Link key={link.label} href={link.href} sx={linkSx}>
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1.5 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.72)', mb: 2, lineHeight: 1.6 }}>
              Recibe novedades y ofertas de vuelos directamente en tu correo.
            </Typography>
            <Stack component="form" spacing={1.25} onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Tu correo electrónico"
                aria-label="Correo electrónico para newsletter"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.35)' },
                    '&:hover fieldset': { borderColor: '#05BFDB' },
                    '&.Mui-focused fieldset': { borderColor: '#05BFDB' },
                  },
                  '& input::placeholder': { color: 'rgba(255, 255, 255, 0.62)', opacity: 1 },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#05BFDB', color: '#063B50', fontWeight: 700, '&:hover': { bgcolor: '#04A8C1' } }}
              >
                Suscribirse
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 5, md: 7 }, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.18)' }}>
          <Typography variant="body2" align="center" sx={{ color: 'rgba(255, 255, 255, 0.65)' }}>
            © 2026 FlightTracker Inc. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
