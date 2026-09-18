import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TerrainRoundedIcon from '@mui/icons-material/TerrainRounded';
import { DESIGN_TOKENS } from '@/theme/theme';

export interface PromoBannerProps {
  onBannerActionClick?: () => void;
}

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Benefit = ({ icon, title, description }: BenefitProps) => (
  <Stack
    direction="row"
    spacing={1.15}
    alignItems="center"
    sx={{ minWidth: { md: 128 }, justifyContent: { xs: 'flex-start', md: 'center' } }}
  >
    <Box
      sx={{
        display: 'grid',
        width: 45,
        height: 45,
        flexShrink: 0,
        placeItems: 'center',
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: 'common.white',
        boxShadow: '0 6px 14px rgba(160, 27, 45, 0.22)',
      }}
    >
      {icon}
    </Box>
    <Typography component="p" sx={{ color: 'text.primary', fontSize: '0.78rem', fontWeight: 800, lineHeight: 1.12 }}>
      {title}
      <Box component="span" sx={{ display: 'block', fontWeight: 600 }}>
        {description}
      </Box>
    </Typography>
  </Stack>
);

export const PromoBanner = ({ onBannerActionClick }: PromoBannerProps) => (
  <Box component="section" aria-labelledby="promo-heading" sx={{ bgcolor: 'background.default', px: { xs: 2, sm: 3 }, py: { xs: 4, md: 6 } }}>
    <Container maxWidth="lg" disableGutters>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'rgba(160, 27, 45, 0.12)',
          borderRadius: { xs: 2.5, md: 3 },
          bgcolor: DESIGN_TOKENS.colors.brandIvory,
          boxShadow: '0 12px 30px rgba(27, 42, 74, 0.08)',
          '&::before': {
            position: 'absolute',
            top: -65,
            right: -25,
            width: 210,
            height: 210,
            border: '28px solid rgba(160, 27, 45, 0.08)',
            borderRadius: '50%',
            content: '""',
          },
        }}
      >
        <Grid container alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={3.25} sx={{ p: { xs: 3, md: 4 } }}>
            <Typography id="promo-heading" component="h2" sx={{ color: 'text.primary', fontSize: { xs: '1.7rem', md: '2rem' }, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em' }}>
              Cada vuelo, mejor
              <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                acompañado
              </Box>
            </Typography>
            <Box sx={{ width: 48, borderTop: '2px solid', borderColor: 'primary.main', my: 1.35 }} />
            <Typography sx={{ maxWidth: 230, color: 'text.secondary', fontSize: '0.82rem', lineHeight: 1.45 }}>
              Encuentra, compara y sigue tus opciones con información clara para viajar con confianza.
            </Typography>
          </Grid>

          <Grid item xs={12} md={5.35} sx={{ px: { xs: 3, md: 2 }, pb: { xs: 3, md: 0 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.6, sm: 0 }} justifyContent="space-around">
              <Benefit icon={<SearchRoundedIcon fontSize="small" />} title="Compara" description="en segundos" />
              <Benefit icon={<NotificationsNoneRoundedIcon fontSize="small" />} title="Alertas" description="que te acompañan" />
              <Benefit icon={<LocalOfferOutlinedIcon fontSize="small" />} title="Ahorra" description="con confianza" />
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'center' }, mt: { xs: 2.5, md: 3 } }}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={onBannerActionClick}
                sx={{ borderRadius: 99, px: 2.75, py: 1.1, fontSize: '0.85rem', fontWeight: 800, boxShadow: '0 6px 16px rgba(160, 27, 45, 0.24)' }}
              >
                Empieza a buscar ahora
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={3.4} sx={{ display: { xs: 'none', md: 'block' }, minHeight: 225, overflow: 'hidden', position: 'relative' }}>
            <TerrainRoundedIcon sx={{ position: 'absolute', right: -28, bottom: -45, color: '#EAD5B7', fontSize: 240, opacity: 0.8 }} />
            <Stack alignItems="center" justifyContent="center" spacing={0.55} sx={{ position: 'relative', minHeight: 225, pt: 3 }}>
              <FlightTakeoffRoundedIcon sx={{ color: 'primary.main', fontSize: 60, transform: 'rotate(-8deg)' }} />
              <Typography sx={{ color: 'text.primary', fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1 }}>
                Chasqui<Box component="span" sx={{ color: 'primary.main' }}>Fly</Box>
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.03em' }}>
                Tu mejor aliado en cada vuelo
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  </Box>
);

export default PromoBanner;
