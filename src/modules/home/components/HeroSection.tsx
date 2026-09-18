import { Box, Container, Typography } from '@mui/material';
import FlightSearchForm from '../../flights/components/FlightSearchForm';
import { FlightSearchFormData } from '../../../types/flight.types';
import heroBrandPanel from '@/assets/hero-brand-panel.png';
import heroMachuPicchu from '@/assets/hero-machu-picchu-hd.jpg';
import { DESIGN_TOKENS } from '@/theme/theme';

export interface HeroSectionProps {
  onSearch?: (searchValues: FlightSearchFormData) => void;
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

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
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
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Typography id="hero-heading" component="h1" sx={visuallyHiddenStyles}>
          Encuentra el mejor vuelo para tu próximo viaje
        </Typography>
        <Typography component="p" sx={visuallyHiddenStyles}>
          Compara vuelos de diferentes aerolíneas y encuentra la mejor opción para tu viaje.
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
          }}
        />

        <Box sx={{ maxWidth: 1120, mx: 'auto', mt: { xs: 3, md: 4 } }}>
          <FlightSearchForm onSearchSubmit={onSearch} />
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
