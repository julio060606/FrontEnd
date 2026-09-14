import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CompareFlightCardData } from '../../../types/compare.types';

export interface CompareHeaderCardsProps {
  flightA: CompareFlightCardData;
  flightB: CompareFlightCardData;
  recommendedFlightId?: string;
  selectedFlightId?: string;
  onSelectFlight?: (flight: CompareFlightCardData) => void;
}

export const CompareHeaderCards: React.FC<CompareHeaderCardsProps> = ({
  flightA,
  flightB,
  recommendedFlightId,
  selectedFlightId,
  onSelectFlight,
}) => {
  const formatDate = (date: string): string =>
    new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));

  const getAirlineBadgeColor = (badgeType: CompareFlightCardData['airline']['colorBadge']) => {
    switch (badgeType) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      case 'info':
        return 'info.main';
      case 'primary':
      default:
        return 'primary.main';
    }
  };

  const renderFlightCard = (flight: CompareFlightCardData) => {
    const isRecommended = flight.id === recommendedFlightId;
    const isSelected = flight.id === selectedFlightId;

    return (
    <Paper
      elevation={0}
      aria-label={`${flight.airline.name} ${flight.flightNumber}${isRecommended ? ', recomendado' : ''}${isSelected ? ', elegido' : ''}`}
      sx={{
        height: '100%',
        p: { xs: 2.5, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 4,
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'success.main' : isRecommended ? 'primary.main' : 'divider',
        boxShadow: isSelected
          ? '0px 6px 24px rgba(16, 185, 129, 0.18)'
          : '0px 4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 2.5,
      }}
    >
      {/* 1. Header: Aerolínea & Tag de Ruta */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: getAirlineBadgeColor(flight.airline.colorBadge),
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
            </svg>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '1rem' }}>
              {flight.airline.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {flight.flightNumber} · {flight.cabinClass}
            </Typography>
          </Box>
        </Stack>

        <Stack alignItems="flex-end" spacing={0.75}>
          <Box sx={{ px: 1.25, py: 0.5, bgcolor: 'customBackgrounds.appBase', borderRadius: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600, fontSize: '0.75rem' }}>
              {flight.routeLabel}
            </Typography>
          </Box>
          {isSelected ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="TU ELECCIÓN"
              color="success"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.625rem' }}
            />
          ) : isRecommended ? (
            <Chip
              label="RECOMENDADO"
              color="primary"
              size="small"
              sx={{ fontWeight: 800, fontSize: '0.625rem' }}
            />
          ) : null}
        </Stack>
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        Salida: {formatDate(flight.departureDate)}
        {flight.returnDate ? ` · Regreso: ${formatDate(flight.returnDate)}` : ''}
      </Typography>

      <Divider />

      {/* 2. Horarios e Indicador de Vuelo */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Origen */}
        <Box sx={{ minWidth: 60 }}>
          <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '1.125rem' }}>
            {flight.departureTime}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
            {flight.departureIata}
          </Typography>
        </Box>

        {/* Línea Central */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6875rem', display: 'block', mb: 0.25 }}>
            {flight.durationFormatted}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
            <Divider sx={{ flexGrow: 1, borderColor: 'divider', borderWidth: 1 }} />
            <Box sx={{ color: 'primary.main', display: 'flex', mx: 0.5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </Box>
            <Divider sx={{ flexGrow: 1, borderColor: 'divider', borderWidth: 1 }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, fontSize: '0.6875rem' }}>
            {flight.stopsFormatted}
          </Typography>
        </Box>

        {/* Destino */}
        <Box sx={{ minWidth: 60, textAlign: 'right' }}>
          <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '1.125rem' }}>
            {flight.arrivalTime}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
            {flight.arrivalIata}
          </Typography>
        </Box>
      </Stack>

      <Divider />

      {/* 3. Precio y Botón de Elección */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: 'block' }}>
            Precio final ida/vuelta
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography
              variant="h2"
              sx={{
                color: flight.isCheapest ? 'success.main' : 'primary.main',
                fontWeight: 800,
                fontSize: '1.5rem',
              }}
            >
              {flight.currency} {flight.price}
            </Typography>

            {flight.isCheapest && (
              <Box sx={{ px: 0.75, py: 0.25, bgcolor: 'soft.success', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 700, fontSize: '0.625rem' }}>
                  MÁS BARATO
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Button
          variant={isSelected ? 'outlined' : 'contained'}
          color={isSelected ? 'success' : 'secondary'}
          aria-pressed={isSelected}
          startIcon={isSelected ? <CheckCircleIcon /> : undefined}
          onClick={() => onSelectFlight?.(flight)}
          sx={{
            fontWeight: 700,
            fontSize: '0.8125rem',
            px: 2.25,
            py: 1,
            borderRadius: 1.5,
          }}
        >
          {isSelected ? 'Vuelo elegido' : 'Elegir vuelo'}
        </Button>
      </Stack>
    </Paper>
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
        <Grid item xs={12} md={6}>
          {renderFlightCard(flightA)}
        </Grid>

        <Grid item xs={12} md={6}>
          {renderFlightCard(flightB)}
        </Grid>
      </Grid>

      {/* Insignia Central "VS" */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: { xs: 'none', md: 'flex' },
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            width: 58,
            height: 58,
            bgcolor: 'primary.main',
            borderRadius: '50%',
            border: 4,
            borderColor: '#FFFFFF',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#FFFFFF',
              fontSize: '1.125rem',
              fontWeight: 900,
              fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}
          >
            VS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CompareHeaderCards;
