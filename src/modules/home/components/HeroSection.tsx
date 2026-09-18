import { Box, Container, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import type { RefObject } from 'react';
import FlightSearchForm from '../../flights/components/FlightSearchForm';
import { FlightSearchFormData } from '../../../types/flight.types';
import heroBrandPanel from '@/assets/hero-brand-panel.png';
import heroMachuPicchu from '@/assets/hero-machu-picchu-hd.jpg';
import { DESIGN_TOKENS } from '@/theme/theme';

export interface HeroSectionProps {
  onSearch?: (searchValues: FlightSearchFormData) => void;
  originInputRef?: RefObject<HTMLInputElement>;
}

const visuallyHiddenStyles = {
  position: 'absolute',
  width: 1,
  height: 1,
  p: 0,
  m: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;

const panelEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const searchFormEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const HeroSection = ({ onSearch, originInputRef }: HeroSectionProps) => {
  return (
    <Box
      component="section"
      aria-labelledby="hero-heading"
      sx={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        bgcolor: 'secondary.main',
        backgroundImage: `url(${heroMachuPicchu})`,
        backgroundPosition: 'center 52%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, sm: 5, md: 7.5 },
        '&::before': {
          position: 'absolute',
          zIndex: -1,
          inset: 0,
          bgcolor: DESIGN_TOKENS.colors.heroOverlay,
          content: '""',
        },
        '&::after': {
          position: 'absolute',
          zIndex: -1,
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 8% 13%, rgba(255, 226, 162, 0.72) 0%, rgba(244, 184, 79, 0.38) 13%, rgba(211, 132, 38, 0.14) 27%, transparent 48%),
            linear-gradient(112deg, rgba(255, 202, 112, 0.2) 0%, rgba(255, 187, 77, 0.08) 22%, transparent 47%)
          `,
          content: '""',
        },
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Typography id="hero-heading" component="h1" sx={visuallyHiddenStyles}>
          Vuela con la confianza de elegir mejor
        </Typography>
        <Typography component="p" sx={visuallyHiddenStyles}>
          Comparamos rutas, horarios y tarifas para que tomes la mejor decisión en cada etapa de tu viaje.
        </Typography>

        <Box
          component="img"
          src={heroBrandPanel}
          alt="ChasquiFly, comparador de vuelos peruano"
          sx={{
            display: 'block',
            width: '100%',
            maxWidth: 1120,
            aspectRatio: '1600 / 396',
            height: 'auto',
            mx: 'auto',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: { xs: 3, md: 5 },
            boxShadow: '0 16px 38px rgba(0, 0, 0, 0.22)',
            animation: `${panelEntrance} 480ms cubic-bezier(0.22, 1, 0.36, 1) both`,
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        />

        <Box
          id="flight-search"
          tabIndex={-1}
          sx={{
            maxWidth: 1120,
            mx: 'auto',
            mt: { xs: 3, md: 4 },
            animation: `${searchFormEntrance} 440ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both`,
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          <FlightSearchForm onSearchSubmit={onSearch} originInputRef={originInputRef} />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
