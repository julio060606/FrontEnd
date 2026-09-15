import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import logoImg from '@/assets/logo.png';

export interface HeaderProps {
  onLoginClick?: () => void;
  activeRoute?: string;
}

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Buscar Vuelos', to: '/flights' },
  { label: 'Comparar Vuelos', to: '/compare' },
  { label: 'Live Tracker', to: '/tracker' },
];

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeDrawer = () => setMobileOpen(false);

  const linkStyles = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 68, md: 80 },
            justifyContent: 'space-between',
            px: { xs: 2, sm: 4, lg: 8 },
          }}
        >
          <Stack direction="row" spacing={{ xs: 2, lg: 5 }} alignItems="center">
            {/* Logo de la plataforma */}
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >


              <Box
                component="img"
                src={logoImg}
                alt="ChaskyFly Logo"
                sx={{
                  height: { xs: 32, md: 38 },
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { xs: '1.15rem', md: '1.35rem' },
                  fontWeight: 800,
                  color: 'primary.main',
                  letterSpacing: '-0.02em',
                }}
              >
                ChaskyFly
              </Typography>








            </Box>

            {!isMobile && (
              <Stack direction="row" spacing={{ md: 2, lg: 3.5 }}>
                {navItems.map((item) => (
                  <Box
                    key={item.label}
                    component={NavLink}
                    to={item.to}
                    style={linkStyles}
                    sx={{
                      py: 1,
                      textDecoration: 'none',
                      fontSize: { md: '0.85rem', lg: '0.9rem' },
                      transition: 'color 0.2s ease',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              component={NavLink}
              to="/login"
              variant="text"
              onClick={onLoginClick}
              sx={{
                display: 'inline-flex',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                textTransform: 'none',
                '&:hover': { color: 'primary.dark', bgcolor: 'soft.primary' },
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              component={NavLink}
              to="/register"
              variant="contained"
              color="primary"
              sx={{
                display: 'inline-flex',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                textTransform: 'none',
                borderRadius: 1.5,
                boxShadow: '0 2px 8px rgba(160, 27, 45, 0.2)',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Registrarse
            </Button>

            {isMobile && (
              <IconButton
                edge="end"
                aria-label="Abrir menú"
                onClick={() => setMobileOpen(true)}
                sx={{ color: 'primary.main' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </Container>

      {/* Drawer Móvil */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: { xs: 'min(280px, 88vw)', sm: 320 }, p: 2.5 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} color="primary.main">
            <Box
              component="img"
              src={logoImg}
              alt="ChaskyFly Logo"
              sx={{
                height: 30,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>
              ChaskyFly
            </Typography>
          </Box>
          <IconButton aria-label="Cerrar menú" onClick={closeDrawer}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.to}
                onClick={closeDrawer}
                sx={{
                  borderRadius: 2,
                  color: 'text.primary',
                  '&.active': { bgcolor: 'soft.primary', color: 'primary.main', fontWeight: 700 },
                }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Stack spacing={1.5} sx={{ mt: 3, pt: 2.5, borderTop: 1, borderColor: 'divider' }}>
          <Button
            component={NavLink}
            to="/login"
            variant="outlined"
            color="primary"
            fullWidth
            onClick={closeDrawer}
            sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1.5 }}
          >
            Iniciar Sesión
          </Button>
          <Button
            component={NavLink}
            to="/register"
            variant="contained"
            color="primary"
            fullWidth
            onClick={closeDrawer}
            sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1.5 }}
          >
            Registrarse
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
};

export default Header;
