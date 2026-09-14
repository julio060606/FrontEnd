import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Paper,
  Grid,
} from '@mui/material';
import { FlightTrackDetail } from '../../../types/tracker.types';

export interface FlightLiveInfoCardProps {
  flight: FlightTrackDetail;
}

export const FlightLiveInfoCard: React.FC<FlightLiveInfoCardProps> = ({ flight }) => {
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
      <Stack spacing={2.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: '#1B2A4A',
              fontWeight: 800,
              fontSize: '18px',
              mb: 2.5,
            }}
          >
            Información de Vuelo
          </Typography>

          {/* Aerolínea & Operador */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#A01B2D',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
              </svg>
            </Box>
            <Box>
              <Typography sx={{ color: '#1B2A4A', fontWeight: 800, fontSize: '16px', fontFamily: 'Inter' }}>
                {flight.airline.name}
              </Typography>
              <Typography sx={{ color: '#6B615E', fontSize: '13px', fontFamily: 'Inter' }}>
                {flight.operatorName}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: '#E2DBD7' }} />

        {/* Telemetría y Detalles Técnicos */}
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#6B615E', fontSize: '14px', fontFamily: 'Inter' }}>
              Vuelo
            </Typography>
            <Typography sx={{ color: '#1B2A4A', fontWeight: 700, fontSize: '14px', fontFamily: 'Inter' }}>
              {flight.flightNumber}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#6B615E', fontSize: '14px', fontFamily: 'Inter' }}>
              Aeronave
            </Typography>
            <Typography sx={{ color: '#1B2A4A', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter' }}>
              {flight.aircraftModel}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#6B615E', fontSize: '14px', fontFamily: 'Inter' }}>
              Altitud
            </Typography>
            <Typography sx={{ color: '#10B981', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter' }}>
              {flight.telemetry.altitudeFormatted}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#6B615E', fontSize: '14px', fontFamily: 'Inter' }}>
              Velocidad
            </Typography>
            <Typography sx={{ color: '#10B981', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter' }}>
              {flight.telemetry.speedFormatted}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: '#E2DBD7' }} />

        {/* Terminal y Gates */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 1.75,
                bgcolor: '#FAF5F0',
                borderRadius: '8px',
                border: '1px solid #E2DBD7',
              }}
            >
              <Typography sx={{ color: '#6B615E', fontWeight: 700, fontSize: '12px', fontFamily: 'Inter', mb: 0.75 }}>
                SALIDA
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '14px', fontFamily: 'Inter', lineHeight: 1.4 }}>
                Terminal: <Box component="span" sx={{ color: '#0F172A', fontWeight: 600 }}>{flight.departureTerminalInfo.terminal}</Box>
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '14px', fontFamily: 'Inter', lineHeight: 1.4 }}>
                Gate: <Box component="span" sx={{ color: '#0F172A', fontWeight: 600 }}>{flight.departureTerminalInfo.gate}</Box>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box
              sx={{
                p: 1.75,
                bgcolor: '#FAF5F0',
                borderRadius: '8px',
                border: '1px solid #E2DBD7',
              }}
            >
              <Typography sx={{ color: '#6B615E', fontWeight: 700, fontSize: '12px', fontFamily: 'Inter', mb: 0.75 }}>
                LLEGADA
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '14px', fontFamily: 'Inter', lineHeight: 1.4 }}>
                Terminal: <Box component="span" sx={{ color: '#0F172A', fontWeight: 600 }}>{flight.arrivalTerminalInfo.terminal}</Box>
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '14px', fontFamily: 'Inter', lineHeight: 1.4 }}>
                Gate: <Box component="span" sx={{ color: '#0F172A', fontWeight: 600 }}>{flight.arrivalTerminalInfo.gate}</Box>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default FlightLiveInfoCard;
