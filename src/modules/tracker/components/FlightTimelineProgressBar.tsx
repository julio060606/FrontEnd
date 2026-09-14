import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { FlightTrackDetail } from '../../../types/tracker.types';

export interface FlightTimelineProgressBarProps {
  flight: FlightTrackDetail;
}

export const FlightTimelineProgressBar: React.FC<FlightTimelineProgressBarProps> = ({ flight }) => {
  const { telemetry } = flight;
  const progress = Math.min(Math.max(telemetry.progressPercentage, 0), 100);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        p: { xs: 3, sm: 4 },
        bgcolor: 'background.paper',
        borderRadius: '16px',
        border: '1px solid #E2DBD7',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={3} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: '#1B2A4A',
              fontWeight: 800,
              fontSize: '18px',
              mb: 3,
            }}
          >
            Ruta y Progreso de Vuelo
          </Typography>

          {/* Barra de Progreso Gráfica con Indicador de Aeronave */}
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: '#1B2A4A', fontWeight: 700, fontSize: '14px', fontFamily: 'Inter' }}>
                {flight.originIata} ({flight.originCity})
              </Typography>
              <Typography sx={{ color: '#1B2A4A', fontWeight: 700, fontSize: '14px', fontFamily: 'Inter' }}>
                {flight.destinationIata} ({flight.destinationCity})
              </Typography>
            </Stack>

            {/* Track y Puntero de Avión */}
            <Box sx={{ position: 'relative', width: '100%', height: 28, display: 'flex', alignItems: 'center' }}>
              {/* Línea Base */}
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  bgcolor: '#E2DBD7',
                  borderRadius: 2,
                }}
              />

              {/* Línea de Progreso Activa */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  width: `${progress}%`,
                  height: 4,
                  bgcolor: '#A01B2D',
                  borderRadius: 2,
                  transition: 'width 0.5s ease',
                }}
              />

              {/* Icono de Avión Flotante */}
              <Box
                sx={{
                  position: 'absolute',
                  left: `calc(${progress}% - 12px)`,
                  width: 24,
                  height: 24,
                  bgcolor: '#A01B2D',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(160, 27, 45, 0.3)',
                  transition: 'left 0.5s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </Box>
            </Box>

            {/* Métricas de Progreso y Distancia */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: '#64748B', fontSize: '13px', fontFamily: 'Inter' }}>
                Progreso:{' '}
                <Box component="span" sx={{ color: '#2563EB', fontWeight: 700 }}>
                  {progress}% completado
                </Box>
              </Typography>

              <Typography sx={{ color: '#64748B', fontSize: '13px', fontFamily: 'Inter' }}>
                Distancia total:{' '}
                <Box component="span" sx={{ color: '#0F172A', fontWeight: 600 }}>
                  {telemetry.totalDistanceFormatted}
                </Box>
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: '#E2DBD7' }} />

        {/* Desglose de Horarios Origen - Duración - Destino */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={{ xs: 2.5, sm: 2 }}
        >
          {/* Origen */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#6B615E', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Inter' }}>
              ORIGEN
            </Typography>
            <Typography sx={{ color: '#1B2A4A', fontWeight: 800, fontSize: '28px', fontFamily: 'Inter', my: 0.25 }}>
              {flight.scheduledDepartureTime}
            </Typography>
            <Typography sx={{ color: '#10B981', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter' }}>
              Salió a las {flight.actualDepartureTime}
            </Typography>
            <Typography sx={{ color: '#6B615E', fontSize: '13px', fontFamily: 'Inter', mt: 0.5, display: 'block' }}>
              {flight.originAirportName}
            </Typography>
          </Box>

          {/* Centro: Duración */}
          <Box sx={{ textAlign: { xs: 'left', sm: 'center' }, px: { sm: 2 } }}>
            <Box sx={{ color: '#6B615E', display: 'inline-flex', mb: 0.25 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </Box>
            <Typography sx={{ color: '#1B2A4A', fontWeight: 700, fontSize: '14px', fontFamily: 'Inter' }}>
              {flight.durationFormatted}
            </Typography>
            <Typography sx={{ color: '#6B615E', fontSize: '11px', fontFamily: 'Inter', display: 'block' }}>
              Duración total
            </Typography>
          </Box>

          {/* Destino */}
          <Box sx={{ flex: 1, textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography sx={{ color: '#6B615E', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Inter' }}>
              DESTINO
            </Typography>
            <Typography sx={{ color: '#1B2A4A', fontWeight: 800, fontSize: '28px', fontFamily: 'Inter', my: 0.25 }}>
              {flight.scheduledArrivalTime}
            </Typography>
            <Typography sx={{ color: '#A01B2D', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter' }}>
              Llegada estimada {flight.estimatedArrivalTime}
            </Typography>
            <Typography sx={{ color: '#6B615E', fontSize: '13px', fontFamily: 'Inter', mt: 0.5, display: 'block' }}>
              {flight.destinationAirportName}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FlightTimelineProgressBar;
