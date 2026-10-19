import { useState, useEffect } from 'react';
import axios from 'axios';
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
  ListItemIcon,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from '@/components/branding/BrandLogo';
import { authService } from '@/services/authService';
import { tripService, UserTrip } from '@/services/tripService';

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

  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tripsModalOpen, setTripsModalOpen] = useState(false);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    const handleOpenLogin = () => {
      if (onLoginClick) onLoginClick();
    };
    const handleTripsChange = async () => {
      if (tripsModalOpen) {
        const trips = await tripService.getUserTrips();
        setUserTrips(trips);
      }
    };

    window.addEventListener('storage', syncUser);
    window.addEventListener('focus', syncUser);
    window.addEventListener('chasquifly:auth-change', syncUser);
    window.addEventListener('chasquifly:open-login', handleOpenLogin);
    window.addEventListener('chasquifly:trips-change', handleTripsChange);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
      window.removeEventListener('chasquifly:auth-change', syncUser);
      window.removeEventListener('chasquifly:open-login', handleOpenLogin);
      window.removeEventListener('chasquifly:trips-change', handleTripsChange);
    };
  }, [tripsModalOpen, onLoginClick]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    handleCloseUserMenu();
  };

  const handleOpenTrips = async () => {
    handleCloseUserMenu();
    setTripsModalOpen(true);
    setLoadingTrips(true);
    try {
      const trips = await tripService.getUserTrips();
      setUserTrips(trips);
    } catch (error) {
      console.warn('Error al cargar mis viajes de Spring Boot:', error);
      setUserTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await tripService.deleteTrip(tripId);
      setUserTrips((prev) => prev.filter((t: any) => t.tripId !== tripId));
    } catch (e) {
      console.error('Error al eliminar viaje:', e);
    }
  };

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
            {currentUser ? (
              <>
                <Button
                  onClick={handleOpenUserMenu}
                  variant="outlined"
                  color="primary"
                  startIcon={<AccountCircleIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'soft.primary', borderColor: 'primary.main' },
                  }}
                >
                  {currentUser.firstName || 'Mi Cuenta'}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{ sx: { minWidth: 220, borderRadius: 2, mt: 1, boxShadow: 3 } }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {currentUser.firstName} {currentUser.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentUser.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleOpenTrips} sx={{ py: 1.25 }}>
                    <ListItemIcon>
                      <FlightTakeoffIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>Mis Viajes Guardados</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: 'error.main' }}>
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>Cerrar sesión</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
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
              </>
            )}

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

      {/* Modal de Mis Viajes Guardados */}
      <Dialog
        open={tripsModalOpen}
        onClose={() => setTripsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FlightTakeoffIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>Mis Viajes Guardados</Typography>
          </Stack>
          <IconButton onClick={() => setTripsModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingTrips ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={36} />
            </Box>
          ) : userTrips.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BookmarkBorderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body1" fontWeight={600} color="text.secondary">
                No tienes viajes guardados aún
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Explora y compara vuelos para agregarlos a tu itinerario personal.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2} sx={{ py: 1 }}>
              {userTrips.map((trip: any) => {
                const depDate = trip.flight?.departureTime ? new Date(trip.flight.departureTime) : null;
                const formattedDate = depDate && !isNaN(depDate.getTime())
                  ? depDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <Card key={trip.tripId} variant="outlined" sx={{ borderRadius: 2, position: 'relative' }}>
                    <CardContent sx={{ pb: '14px !important' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" fontWeight={800} color="secondary.main">
                            {trip.flight?.flightNumber || 'Vuelo'}
                          </Typography>
                          {trip.flight?.airline?.name && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                              · {trip.flight.airline.name}
                            </Typography>
                          )}
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {trip.flight?.basePrice && (
                            <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                              USD ${trip.flight.basePrice}
                            </Typography>
                          )}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteTrip(trip.tripId)}
                            title="Eliminar de Mis Viajes"
                            sx={{ p: 0.5 }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Typography variant="body2" color="text.primary" fontWeight={600} sx={{ mt: 0.75 }}>
                        {trip.flight?.origin?.city || 'Origen'} ({trip.flight?.origin?.iataCode}) ➔ {trip.flight?.destination?.city || 'Destino'} ({trip.flight?.destination?.iataCode})
                      </Typography>

                      {formattedDate && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                          Salida: {formattedDate}
                        </Typography>
                      )}

                      {trip.notes && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block', fontStyle: 'italic', bgcolor: 'background.default', p: 0.5, borderRadius: 1 }}>
                          {trip.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setTripsModalOpen(false)} variant="contained" color="primary" sx={{ borderRadius: 1.5 }}>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

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
          {currentUser && (
            <ListItem disablePadding sx={{ mb: 0.75 }}>
              <ListItemButton
                onClick={() => { closeDrawer(); handleOpenTrips(); }}
                sx={{ borderRadius: 1.5, color: 'primary.main' }}
              >
                <ListItemText primary="Mis Viajes Guardados" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Box sx={{ mt: 'auto', pt: 2.5 }}>
          <Divider sx={{ mb: 2.5 }} />
          {currentUser ? (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => { closeDrawer(); handleLogout(); }}
              sx={{ fontWeight: 700, borderRadius: 1.5 }}
            >
              Cerrar sesión
            </Button>
          ) : (
            <>
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
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
