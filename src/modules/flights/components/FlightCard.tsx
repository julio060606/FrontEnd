import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
  Chip,
  Collapse,
  Tooltip,
} from '@mui/material';
import { FlightItem } from '../../../types/flight.types';

export interface FlightCardProps {
  flight: FlightItem;
  onViewDetailsClick?: (flight: FlightItem) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onViewDetailsClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mapeo semántico de colores para el badge de la aerolínea
  const getAirlineBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      case 'info':
        return '#2563EB';
      case 'primary':
      default:
        return '#A01B2D';
    }
  };

  const getOfferBadgeStyle = (offerText?: string) => {
    if (!offerText) return null;
    if (offerText.toLowerCase().includes('barato')) {
      return {
        bg: '#DCFCE7',
        color: '#15803D',
        border: 'rgba(16, 185, 129, 0.3)',
      };
    }
    if (offerText.toLowerCase().includes('recom')) {
      return {
        bg: '#FDE8EC',
        color: '#A01B2D',
        border: 'rgba(160, 27, 45, 0.3)',
      };
    }
    return {
      bg: 'rgba(249, 115, 22, 0.15)',
      color: '#C2410C',
      border: 'rgba(249, 115, 22, 0.4)',
    };
  };

  const isDirect = flight.stopsCount === 0;
  const offerStyle = getOfferBadgeStyle(flight.badgeOffer);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.25s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0px 8px 30px rgba(27, 42, 74, 0.1)',
          borderColor: 'primary.main',
        },
      }}
    >
      {/* 1. Header / Ribbon de Oferta Destacada */}
      {flight.badgeOffer && offerStyle && (
        <Box
          sx={{
            bgcolor: offerStyle.bg,
            color: offerStyle.color,
            borderBottom: `1px solid ${offerStyle.border}`,
            px: { xs: 2, md: 3 },
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.02em' }}>
            {flight.badgeOffer.toUpperCase()} · Tarifa recomendada por ChasquiFly
          </Typography>
        </Box>
      )}

      {/* 2. Cuerpo Principal de la Tarjeta */}
      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={{ xs: 2.5, md: 3 }}
        >
          {/* Bloque Aerolínea & Cabina */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: { md: 190 } }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                bgcolor: getAirlineBadgeColor(flight.airline.colorBadge),
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
              </svg>
            </Box>

            <Box>
              <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
                {flight.airline.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: 'block', mt: 0.25 }}>
                {flight.cabinClass} · <strong>{flight.flightNumber}</strong>
              </Typography>
            </Box>
          </Stack>

          {/* Bloque Itinerario (Salida -> Línea -> Llegada) */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={{ xs: 2, sm: 3 }}
            sx={{ flex: 1, maxWidth: { md: 400 }, mx: { md: 'auto' } }}
          >
            {/* Hora y Aeropuerto de Salida */}
            <Box sx={{ textAlign: 'right', minWidth: 65 }}>
              <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.1 }}>
                {flight.departureTime}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.8125rem' }}>
                {flight.originIata}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem', display: 'block' }}>
                {flight.originCity}
              </Typography>
            </Box>

            {/* Línea Central con Duración y Escalas */}
            <Box sx={{ flex: 1, textAlign: 'center', px: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: 'block', mb: 0.5, fontWeight: 500 }}>
                {flight.durationFormatted}
              </Typography>

              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', my: 0.5 }}>
                <Divider sx={{ flexGrow: 1, borderColor: 'divider', borderWidth: 1 }} />
                <Box
                  sx={{
                    color: 'info.main',
                    display: 'flex',
                    mx: 0.75,
                    bgcolor: 'info.light',
                    p: 0.5,
                    borderRadius: '50%',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </Box>
                <Divider sx={{ flexGrow: 1, borderColor: 'divider', borderWidth: 1 }} />
              </Box>

              <Chip
                label={flight.stopsFormatted}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: isDirect ? '#DCFCE7' : 'rgba(249, 115, 22, 0.15)',
                  color: isDirect ? '#15803D' : '#C2410C',
                  border: 1,
                  borderColor: isDirect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(249, 115, 22, 0.3)',
                }}
              />
            </Box>

            {/* Hora y Aeropuerto de Llegada */}
            <Box sx={{ textAlign: 'left', minWidth: 65 }}>
              <Typography variant="body1" sx={{ color: 'secondary.main', fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.1 }}>
                {flight.arrivalTime}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.8125rem' }}>
                {flight.destinationIata}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem', display: 'block' }}>
                {flight.destinationCity}
              </Typography>
            </Box>
          </Stack>

          {/* Bloque Precio y Botón de Acción */}
          <Stack
            direction={{ xs: 'row', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2.5}
            sx={{ minWidth: { md: 220 } }}
          >
            <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: 'block' }}>
                Precio final
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: { xs: '1.35rem', md: '1.5rem' },
                  lineHeight: 1.1,
                }}
              >
                {flight.currency} {flight.price}
              </Typography>
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, fontSize: '0.75rem' }}>
                {flight.tripTypeLabel}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => onViewDetailsClick?.(flight)}
              sx={{
                px: 2.5,
                py: 1.2,
                borderRadius: 1,
                fontWeight: 700,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(160, 27, 45, 0.2)',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: '0 4px 12px rgba(160, 27, 45, 0.35)',
                },
              }}
            >
              Ver detalles
            </Button>
          </Stack>
        </Stack>

        {/* 3. Barra Inferior Sutil: Equipajes y Desglose Rápido */}
        <Divider sx={{ my: 1.5, borderColor: 'divider' }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 0.5 }}
        >
          {/* Indicadores de Equipaje */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Artículo personal (mochila bajo el asiento) incluido">
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                </svg>
                <Typography variant="caption" sx={{ fontSize: '0.725rem', color: 'text.secondary' }}>
                  Mochila
                </Typography>
              </Stack>
            </Tooltip>

            {flight.baggageIncluded?.carryOn && (
              <Tooltip title="Equipaje de mano (10 kg en cabina) incluido">
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'success.main', fontSize: '0.75rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="6" width="14" height="16" rx="2"></rect>
                    <line x1="9" y1="2" x2="15" y2="2"></line>
                    <line x1="9" y1="10" x2="9" y2="10.01"></line>
                  </svg>
                  <Typography variant="caption" sx={{ fontSize: '0.725rem', color: 'success.main', fontWeight: 600 }}>
                    Equipaje de mano
                  </Typography>
                </Stack>
              </Tooltip>
            )}

            {flight.baggageIncluded?.checkedBag && (
              <Tooltip title="Equipaje en bodega (23 kg) incluido">
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'info.main', fontSize: '0.75rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7h-3V4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                  </svg>
                  <Typography variant="caption" sx={{ fontSize: '0.725rem', color: 'info.main', fontWeight: 600 }}>
                    Bodega 23kg
                  </Typography>
                </Stack>
              </Tooltip>
            )}
          </Stack>

          {/* Botón de Expansión de Itinerario Rápido */}
          <Button
            size="small"
            variant="text"
            onClick={() => setIsExpanded(!isExpanded)}
            endIcon={
              <Box
                sx={{
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  display: 'flex',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Box>
            }
            sx={{
              p: 0,
              minWidth: 'auto',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'transparent',
                color: 'primary.main',
              },
            }}
          >
            {isExpanded ? 'Ocultar itinerario' : 'Ver escalas e itinerario'}
          </Button>
        </Stack>

        {/* 4. Sección Desplegable de Itinerario Rápido */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'customBackgrounds.appBase',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main', mb: 1, fontSize: '0.8125rem' }}>
              Desglose del Itinerario:
            </Typography>

            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondary.main', minWidth: 45 }}>
                  {flight.departureTime}
                </Typography>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                <Typography variant="caption" sx={{ color: 'text.primary' }}>
                  Salida de <strong>{flight.originCity} ({flight.originIata})</strong> · Vuelo {flight.flightNumber}
                </Typography>
              </Stack>

              {flight.stopsDetails && flight.stopsDetails.length > 0 && (
                flight.stopsDetails.map((stop, idx) => (
                  <Box key={`stop-detail-${idx}`} sx={{ pl: 7, py: 0.5, borderLeft: '2px dashed #E2DBD7', ml: 7.5 }}>
                    <Typography variant="caption" sx={{ color: 'warning.dark', fontWeight: 600, bgcolor: 'warning.light', px: 1, py: 0.25, borderRadius: 1 }}>
                      Escala en {stop.airportCity} ({stop.airportIata}) · {stop.layoverDuration}
                    </Typography>
                  </Box>
                ))
              )}

              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondary.main', minWidth: 45 }}>
                  {flight.arrivalTime}
                </Typography>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                <Typography variant="caption" sx={{ color: 'text.primary' }}>
                  Llegada a <strong>{flight.destinationCity} ({flight.destinationIata})</strong> · Duración total {flight.durationFormatted}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default FlightCard;
