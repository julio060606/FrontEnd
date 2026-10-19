import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import FlightDetailHeader from '../components/FlightDetailHeader';
import FlightAmenitiesAndPolicies from '../components/FlightAmenitiesAndPolicies';
import FareSummary from '../components/FareSummary';
import AlternativeFlights from '../components/AlternativeFlights';
import { flightDetailService } from '../../../services/flightDetailService';
import { tripService } from '../../../services/tripService';
import { authService } from '../../../services/authService';
import { FlightDetail, AlternativeFlight } from '../../../types/flightDetail.types';

export interface FlightDetailPageProps {
  flightId?: string;
  onNavigateBack?: () => void;
}

export const FlightDetailPage: React.FC<FlightDetailPageProps> = ({
  flightId: propFlightId,
  onNavigateBack,
}) => {
  const { id: routeFlightId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activeFlightId = routeFlightId || propFlightId || 'la-2045-detail';

  const [flight, setFlight] = useState<FlightDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  useEffect(() => {
    let isMounted = true;

    const loadFlightDetails = async () => {
      try {
        setIsLoading(true);
        const data = await flightDetailService.getFlightDetailById(activeFlightId);
        if (isMounted) {
          setFlight(data);
        }
      } catch (error) {
        console.error('Error al cargar detalle del vuelo:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFlightDetails();

    return () => {
      isMounted = false;
    };
  }, [activeFlightId]);

  const handleSelectAlternative = (alt: AlternativeFlight) => {
    navigate(`/flights/${alt.id}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setSnackbarMessage('¡Enlace del vuelo copiado al portapapeles!');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }
  };

  const handleSaveToTrips = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      setSnackbarMessage('Debes iniciar sesión para guardar vuelos en tu itinerario personal.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      window.dispatchEvent(new CustomEvent('chasquifly:open-login'));
      return;
    }

    try {
      const flightLabel = flight ? `${flight.flightNumber} (${flight.originIata} ➔ ${flight.destinationIata})` : 'Vuelo';
      await tripService.saveTrip(activeFlightId, `Vuelo guardado: ${flightLabel}`);
      setSnackbarMessage(`¡${flightLabel} guardado en Mis Viajes exitosamente!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error('Error al guardar viaje:', err);
      setSnackbarMessage(err.message || 'No se pudo guardar el vuelo en Mis Viajes.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Contenido Principal */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 }, px: { xs: 2, sm: 4, lg: 8 } }}>
        <Container maxWidth="xl" disableGutters>
          {/* Breadcrumbs de Navegación */}
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{
              mb: { xs: 3, md: 4 },
              '& .MuiBreadcrumbs-separator': { color: 'text.secondary', fontSize: '1rem' },
            }}
          >
            <Link
              underline="hover"
              color="text.secondary"
              onClick={() => navigate('/')}
              sx={{ fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Inicio
            </Link>
            <Link
              underline="hover"
              color="text.secondary"
              onClick={() => {
                if (onNavigateBack) onNavigateBack();
                else navigate('/flights');
              }}
              sx={{ fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
            >
              Resultados de búsqueda
            </Link>
            <Typography color="primary.main" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              {flight ? `Detalle ${flight.flightNumber}` : 'Detalle del vuelo'}
            </Typography>
          </Breadcrumbs>

          {isLoading || !flight ? (
            <Grid container spacing={4}>
              <Grid item xs={12} lg={8}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: 4, mb: 3 }} />
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: 4 }} />
              </Grid>
              <Grid item xs={12} lg={4}>
                <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4 }} />
              </Grid>
            </Grid>
          ) : (
            <Stack spacing={4}>
              {/* Layout Superior: Detalles + Resumen de Tarifa */}
              <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
                {/* Columna Izquierda: Información de Vuelo & Políticas */}
                <Grid item xs={12} lg={7.5} xl={8}>
                  <Stack spacing={3}>
                    <FlightDetailHeader flight={flight} />
                    <FlightAmenitiesAndPolicies items={flight.amenitiesAndPolicies} />
                  </Stack>
                </Grid>

                {/* Columna Derecha: Tarjeta de Resumen de Tarifa y Redirección */}
                <Grid item xs={12} lg={4.5} xl={4}>
                  <FareSummary
                    fareSummary={flight.fareSummary}
                    airlineName={flight.airline.name}
                    externalBookingUrl={flight.externalBookingUrl}
                    onShareClick={handleShare}
                    onSaveToTripsClick={handleSaveToTrips}
                  />
                </Grid>
              </Grid>

              {/* Layout Inferior: Vuelos Alternativos Recomendados */}
              <Box sx={{ pt: { xs: 2, md: 3 } }}>
                <AlternativeFlights
                  alternatives={flight.alternatives}
                  onSelectAlternative={handleSelectAlternative}
                />
              </Box>
            </Stack>
          )}
        </Container>
      </Box>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlightDetailPage;
