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

export interface HeaderProps {
  onLoginClick?: () => void;
  activeRoute?: string;
}

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Comparar Vuelos', to: '/compare' },
  { label: 'Estado de Vuelos', to: '/status' },
  { label: 'Live Tracker', to: '/tracker' },
];

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeDrawer = () => setMobileOpen(false);

  const linkStyles = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#B30000' : '#8B0000',
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <AppBar position="sticky" color="default" elevation={2} sx={{ bgcolor: '#FFFFFF' }}>
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
            <Box
              component={NavLink}
              to="/"
              sx={{
                display:'flex' , 
                alignItems: 'center',
                gap: 1,
                color: '#8B0000',
                textDecoration: 'none',
              }}
            >
              <FlightTakeoffIcon sx={{ fontSize: { xs: 30, md: 34 } }} />
              <Typography
                variant="h6"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { xs: '1.15rem', md: '1.35rem' },
                  fontWeight: 800,
                  color: '#8B0000',
                }}
              >
                FlightTracker
              </Typography>
            </Box>

            {!isMobile && (
              <Stack direction="row" spacing={{ md: 2, lg: 3 }}>
                {navItems.map((item) => (
                  <Box
                    key={item.label}
                    component={NavLink}
                    to={item.to}
                    style={linkStyles}
                    sx={{
                      py: 1,
                      textDecoration: 'none',
                      fontSize: { md: '0.8rem', lg: '0.875rem' },
                      '&:hover': { color: '#B30000' },
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
                display: 'inline-flex', // Siempre visible
                color: '#8B0000',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Ajuste opcional para pantallas muy chicas
                '&:hover': { color: '#B30000', bgcolor: 'rgba(139, 0, 0, 0.08)' },
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              component={NavLink}
              to="/register"
              variant="contained"
              sx={{
                display: 'inline-flex', // Siempre visible
                bgcolor: '#8B0000',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Ajuste opcional para pantallas muy chicas
                '&:hover': { bgcolor: '#660000' },
              }}
            >
              Registrarse
            </Button>
            {isMobile && (
              <IconButton
                edge="end"
                aria-label="Abrir menú"
                onClick={() => setMobileOpen(true)}
                sx={{ color: '#8B0000' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </Container>



      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: { xs: 'min(280px, 88vw)', sm: 320 }, p: 2 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#8B0000', fontWeight: 800 }}>
            FlightTracker
          </Typography>
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
                  borderRadius: 0,
                  color: '#8B0000',
                  '&.active': { bgcolor: 'rgba(139, 0, 0, 0.1)', color: '#B30000' },
                }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Stack spacing={1} sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            component={NavLink}
            to="/login"
            variant="text"
            fullWidth
            onClick={closeDrawer}
            sx={{ color: '#8B0000', fontWeight: 700 }}
          >
            Iniciar Sesión
          </Button>
          <Button
            component={NavLink}
            to="/register"
            variant="contained"
            fullWidth
            onClick={closeDrawer}
            sx={{ bgcolor: '#8B0000', color: '#FFFFFF', fontWeight: 700, '&:hover': { bgcolor: '#660000' } }}
          >
            Registrarse
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
};

export default Header;