import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
} from '@mui/material';
import FlightSearchForm from '../../flights/components/FlightSearchForm';
import { FlightSearchFormData } from '../../../types/flight.types';

export interface HeroSectionProps {
  onSearch?: (searchValues: FlightSearchFormData) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'secondary.main',
        backgroundImage:
          'linear-gradient(180deg, rgba(27, 42, 74, 0.75) 0%, rgba(27, 42, 74, 0.9) 100%), url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pt: { xs: 6, md: 8 },
        pb: { xs: 8, md: 10 },
        px: { xs: 2, sm: 4, lg: 8 },
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Stack spacing={{ xs: 4, md: 5 }} alignItems="center">
          {/* Hero Main Headline */}
          <Box sx={{ textAlign: 'center', maxWidth: 840, mx: 'auto' }}>
            <Typography
              variant="h1"
              sx={{
                color: '#FFFFFF',
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Encuentra y compara las mejores rutas de vuelo en el Perú
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.disabled',
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 400,
              }}
            >
              Compara precios, monitorea estados en tiempo real y recibe alertas inteligentes antes de despegar.
            </Typography>
          </Box>

          {/* Formulario de Búsqueda interactivo (US04) integrado en el Hero */}
          <FlightSearchForm onSearchSubmit={onSearch} />
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
