import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import FlightTrackerSearch from '../components/FlightTrackerSearch';
import FlightStatusBanner from '../components/FlightStatusBanner';
import FlightTimelineProgressBar from '../components/FlightTimelineProgressBar';
import FlightLiveInfoCard from '../components/FlightLiveInfoCard';
import FlightChronology from '../components/FlightChronology';
import FlightNotificationToggles from '../components/FlightNotificationToggles';
import { trackerService } from '../../../services/trackerService';
import { FlightTrackDetail } from '../../../types/tracker.types';

export const FlightTrackerPage: React.FC = () => {
  const [flightData, setFlightData] = useState<FlightTrackDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const fetchTrackData = async (flightNum: string = 'LA 2045', date: string = '15 Sep 2025') => {
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
  }, []);

  const handleSearch = (flightNumber: string, date: string) => {
    fetchTrackData(flightNumber, date);
    setSnackbarMessage(`Buscando telemetría para el vuelo ${flightNumber}`);
    setSnackbarOpen(true);
  };

  const handleNotificationsChange = (newSettings: any) => {
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
                Seguimiento de vuelo
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem', mt: 0.5 }}>
                Consulta el estado de tu vuelo y telemetría en tiempo real
              </Typography>
            </Box>

            {/* Buscador de Vuelo */}
            <FlightTrackerSearch onSearch={handleSearch} isLoading={isLoading} />

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
          severity="success"
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
