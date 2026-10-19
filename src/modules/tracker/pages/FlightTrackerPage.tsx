import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Skeleton,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlightTrackerSearch from '../components/FlightTrackerSearch';
import FlightStatusBanner from '../components/FlightStatusBanner';
import FlightTimelineProgressBar from '../components/FlightTimelineProgressBar';
import FlightLiveInfoCard from '../components/FlightLiveInfoCard';
import FlightChronology from '../components/FlightChronology';
import FlightNotificationToggles from '../components/FlightNotificationToggles';
import { trackerService } from '../../../services/trackerService';
import { FlightTrackDetail } from '../../../types/tracker.types';

export const FlightTrackerPage: React.FC = () => {
  const { flightId: routeFlightId } = useParams<{ flightId: string }>();
  const [flightData, setFlightData] = useState<FlightTrackDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const fetchTrackData = async (
    flightNum: string = routeFlightId || 'LA2010',
    date: string = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  ) => {
    try {
      setIsLoading(true);
      const data = await trackerService.trackFlight(flightNum, date);
      setFlightData(data);
    } catch (error) {
      console.error('Error al obtener datos de seguimiento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackData();
  }, [routeFlightId]);

  const handleSearch = (flightNumber: string, date: string) => {
    fetchTrackData(flightNumber, date);
    setSnackbarMessage(`Consultando telemetría para el vuelo ${flightNumber}`);
    setSnackbarOpen(true);
  };

  const handleNotificationsChange = () => {
    setSnackbarMessage('Preferencias de alerta actualizadas correctamente');
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Contenido Principal */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, px: { xs: 2, sm: 4, lg: 8 } }}>
        <Container maxWidth="xl" disableGutters>
          <Stack spacing={4}>
            {/* Título de la Sección */}
            <Box>
              <Typography
                variant="h1"
                sx={{
                  color: 'secondary.main',
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Seguimiento de vuelo en tiempo real
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem', mt: 0.5 }}>
                Telemetría en vivo, estado de puertas de embarque y cronología de vuelo
              </Typography>
            </Box>

            {/* Buscador de Vuelo */}
            <FlightTrackerSearch
              initialFlightNumber={routeFlightId || 'LA2010'}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {isLoading || !flightData ? (
              <Stack spacing={3}>
                <Skeleton variant="rounded" height={64} sx={{ borderRadius: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                    <Skeleton variant="rounded" height={260} sx={{ borderRadius: 4 }} />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Skeleton variant="rounded" height={260} sx={{ borderRadius: 4 }} />
                  </Grid>
                </Grid>
                <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4 }} />
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: 4 }} />
              </Stack>
            ) : (
              <Stack spacing={3.5}>
                {/* Banner Informativo si el vuelo está programado a futuro */}
                {flightData.isUpcoming && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: 'rgba(2, 132, 199, 0.08)',
                      border: '1px solid rgba(2, 132, 199, 0.3)',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <AccessTimeIcon sx={{ color: '#0284c7', fontSize: 36, flexShrink: 0 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: '#0369a1', fontWeight: 800 }}>
                        Vuelo Programado ({flightData.timeUntilDeparture})
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                        Tu vuelo {flightData.flightNumber} ({flightData.originIata} ➔ {flightData.destinationIata}) saldrá el <strong>{flightData.dateFormatted}</strong> a las <strong>{flightData.scheduledDepartureTime}</strong>. La aeronave se encuentra actualmente en tierra en {flightData.originAirportName}.
                      </Typography>
                    </Box>
                  </Paper>
                )}

                {/* Banner de Estado en Vivo */}
                <FlightStatusBanner flight={flightData} />

                {/* Fila Superior: Barra de Progreso (Flex 1) y Ficha Técnica (440px fija en desktop) */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    alignItems: 'stretch',
                    gap: 4,
                    width: '100%',
                  }}
                >
                  <Box sx={{ flex: '1 1 0', display: 'flex', width: '100%', minWidth: 0 }}>
                    <FlightTimelineProgressBar flight={flightData} />
                  </Box>

                  <Box sx={{ width: { xs: '100%', lg: 440 }, flexShrink: 0, display: 'flex' }}>
                    <FlightLiveInfoCard flight={flightData} />
                  </Box>
                </Box>

                {/* Cronología e Historial de Eventos */}
                <FlightChronology events={flightData.chronology} />

                {/* Configuración de Alertas y Notificaciones */}
                <FlightNotificationToggles
                  initialSettings={flightData.notificationSettings}
                  onChange={handleNotificationsChange}
                />
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Feedback flotante para interacción de usuario */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlightTrackerPage;
