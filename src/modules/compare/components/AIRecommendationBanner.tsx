import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  LinearProgress,
  Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AIRecommendation } from '../../../types/compare.types';

export interface AIRecommendationBannerProps {
  recommendation: AIRecommendation;
  isRecommendedFlightSelected?: boolean;
  onSelectRecommended?: () => void;
}

export const AIRecommendationBanner: React.FC<AIRecommendationBannerProps> = ({
  recommendation,
  isRecommendedFlightSelected = false,
  onSelectRecommended,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 3, sm: 4, md: 5 },
        background: 'linear-gradient(90deg, #1B2A4A 0%, #261A33 100%)',
        borderRadius: 4,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'flex-start', lg: 'center' },
        gap: { xs: 3.5, lg: 5 },
      }}
    >
      {/* 1. Columna Izquierda: criterio, título y puntuaciones */}
      <Stack spacing={2} sx={{ maxWidth: { lg: 340 }, width: '100%' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.75,
            bgcolor: 'rgba(249, 115, 22, 0.18)',
            border: 1,
            borderColor: 'warning.main',
            borderRadius: '100px',
            alignSelf: 'flex-start',
          }}
        >
          <Box sx={{ color: 'warning.main', display: 'flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'warning.main',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
            }}
          >
            RECOMENDACIÓN INTELIGENTE
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: { xs: '1.4rem', sm: '1.65rem' },
            lineHeight: 1.25,
          }}
        >
          {recommendation.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {recommendation.description}
        </Typography>

        {onSelectRecommended && (
          <Button
            variant={isRecommendedFlightSelected ? 'outlined' : 'contained'}
            color="warning"
            startIcon={<CheckCircleOutlineIcon />}
            aria-pressed={isRecommendedFlightSelected}
            onClick={onSelectRecommended}
            sx={{
              alignSelf: 'flex-start',
              color: isRecommendedFlightSelected ? 'warning.main' : 'secondary.main',
              borderColor: 'warning.main',
              fontWeight: 800,
            }}
          >
            {isRecommendedFlightSelected
              ? `${recommendation.recommendedFlightNumber} elegido`
              : `Elegir ${recommendation.recommendedFlightNumber}`}
          </Button>
        )}

        <Stack spacing={1.5} aria-label="Puntuación de los vuelos comparados">
          {[
            {
              flightNumber: recommendation.recommendedFlightNumber,
              airlineName: recommendation.recommendedAirlineName,
              score: recommendation.recommendedScore,
              highlighted: true,
            },
            {
              flightNumber: recommendation.alternativeFlightNumber,
              airlineName: recommendation.alternativeAirlineName,
              score: recommendation.alternativeScore,
              highlighted: false,
            },
          ].map((flight) => (
            <Box key={flight.flightNumber}>
              <Stack direction="row" justifyContent="space-between" spacing={2} mb={0.5}>
                <Typography
                  variant="caption"
                  sx={{ color: '#FFFFFF', fontWeight: flight.highlighted ? 700 : 500 }}
                >
                  {flight.airlineName} · {flight.flightNumber}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: flight.highlighted ? 'warning.main' : '#FFFFFF', fontWeight: 800 }}
                >
                  {flight.score}/100
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={flight.score}
                aria-label={`Puntuación de ${flight.airlineName}: ${flight.score} de 100`}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  bgcolor: 'rgba(255, 255, 255, 0.14)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    bgcolor: flight.highlighted ? 'warning.main' : 'rgba(255, 255, 255, 0.55)',
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* Divisor Vertical */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          display: { xs: 'none', lg: 'block' },
          borderColor: 'rgba(255, 255, 255, 0.15)',
          minHeight: 180,
        }}
      />

      {/* 2. Columna Derecha: razones verificables y alcance */}
      <Stack spacing={2.5} sx={{ flex: 1, width: '100%' }}>
        <Typography
          variant="overline"
          sx={{ color: 'rgba(255, 255, 255, 0.72)', fontWeight: 700, letterSpacing: '0.08em' }}
        >
          Por qué gana en “{recommendation.priorityLabel}”
        </Typography>
        <Stack spacing={1.5}>
          {recommendation.reasons.map((reason) => (
            <Stack key={reason.id} direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'warning.main',
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </Box>

              <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.925rem' }}>
                {reason.highlightText && (
                  <Box component="span" sx={{ color: 'warning.main', fontWeight: 700, mr: 0.75 }}>
                    {reason.highlightText}
                  </Box>
                )}
                {reason.text}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.75rem',
            lineHeight: 1.4,
            pt: 0.5,
          }}
        >
          {recommendation.disclaimer}
        </Typography>
      </Stack>
    </Box>
  );
};

export default AIRecommendationBanner;
