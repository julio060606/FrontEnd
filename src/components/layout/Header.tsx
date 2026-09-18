import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router-dom';
import BrandLogo from '@/components/branding/BrandLogo';

export interface HeaderProps {
  onLoginClick?: () => void;
  activeRoute?: string;
}

const navItems = [
  { label: 'Inicio', to: '/' },
  { label: 'Buscar vuelos', to: '/flights' },
  { label: 'Comparar vuelos', to: '/compare' },
  { label: 'Live Tracker', to: '/tracker' },
];

export const Header = ({ onLoginClick }: HeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeDrawer = () => setMobileOpen(false);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 84, md: 98 },
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3, lg: 1 },
          }}
        >
          <Stack direction="row" spacing={{ md: 3, lg: 4 }} alignItems="center">
            <Box
              component={NavLink}
              to="/"
              aria-label="ChasquiFly, ir al inicio"
              sx={{ display: 'flex', alignItems: 'center', lineHeight: 0 }}
            >
              <BrandLogo variant="navbar" />
            </Box>

            {!isMobile && (
              <Stack component="nav" aria-label="Navegación principal" direction="row" spacing={{ md: 1.75, lg: 2.75 }}>
                {navItems.map((item) => (
                  <Box
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    end={item.to === '/'}
                    sx={{
                      position: 'relative',
                      py: 1.25,
                      color: 'text.secondary',
                      fontSize: { md: '0.8rem', lg: '0.875rem' },
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      '&::after': {
                        position: 'absolute',
                        right: 0,
                        bottom: 3,
                        left: 0,
                        height: 2,
                        borderRadius: 999,
                        bgcolor: 'primary.main',
                        content: '""',
                        opacity: 0,
                        transform: 'scaleX(0.4)',
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                      },
                      '&:hover': { color: 'primary.main' },
                      '&.active': {
                        color: 'primary.main',
                        fontWeight: 700,
                        '&::after': { opacity: 1, transform: 'scaleX(1)' },
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={NavLink}
              to="/login"
              variant="text"
              onClick={onLoginClick}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                color: 'text.primary',
                fontSize: '0.84rem',
                fontWeight: 600,
                '&:hover': { bgcolor: 'soft.primary', color: 'primary.main' },
              }}
            >
              Iniciar sesión
            </Button>

            <Button
              component={NavLink}
              to="/register"
              variant="contained"
              color="primary"
              sx={{
                minWidth: { xs: 104, sm: 118 },
                px: { xs: 1.5, sm: 2 },
                py: 0.9,
                fontSize: { xs: '0.75rem', sm: '0.84rem' },
                fontWeight: 700,
                borderRadius: 1.5,
                boxShadow: '0 3px 10px rgba(160, 27, 45, 0.18)',
              }}
            >
              Registrarse
            </Button>

            {isMobile && (
              <IconButton
                aria-label="Abrir menú"
                onClick={() => setMobileOpen(true)}
                sx={{ color: 'text.primary' }}
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
        PaperProps={{ sx: { width: 'min(320px, 88vw)', p: 2.5, bgcolor: 'background.paper' } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Box component={NavLink} to="/" onClick={closeDrawer} sx={{ display: 'flex', lineHeight: 0 }}>
            <BrandLogo variant="navbar" />
          </Box>
          <IconButton aria-label="Cerrar menú" onClick={closeDrawer}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider />

        <List component="nav" aria-label="Navegación móvil" sx={{ py: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.75 }}>
              <ListItemButton
                component={NavLink}
                to={item.to}
                end={item.to === '/'}
                onClick={closeDrawer}
                sx={{
                  borderRadius: 1.5,
                  color: 'text.primary',
                  '&.active': { bgcolor: 'soft.primary', color: 'primary.main' },
                }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 650 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 2.5 }}>
          <Divider sx={{ mb: 2.5 }} />
          <Button
            component={NavLink}
            to="/login"
            variant="outlined"
            color="primary"
            fullWidth
            onClick={closeDrawer}
            sx={{ fontWeight: 700, borderRadius: 1.5 }}
          >
            Iniciar sesión
          </Button>
          <Button
            component={NavLink}
            to="/register"
            variant="contained"
            color="primary"
            fullWidth
            onClick={closeDrawer}
            sx={{ mt: 1.25, fontWeight: 700, borderRadius: 1.5 }}
          >
            Registrarse
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
