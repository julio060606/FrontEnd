import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { NavLink } from 'react-router-dom';
import { DESIGN_TOKENS } from '@/theme/theme';

const companyLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Socios', href: '#socios' },
  { label: 'Prensa', href: '#prensa' },
];

const supportLinks = [
  { label: 'Centro de ayuda', href: '#ayuda' },
  { label: 'Reclamaciones', href: '#reclamaciones' },
  { label: 'Contacto', href: '#contacto' },
];

const legalLinks = [
  { label: 'Privacidad', href: '#privacidad' },
  { label: 'Términos', href: '#terminos' },
  { label: 'Cookies', href: '#cookies' },
];

const footerLinkSx = {
  color: DESIGN_TOKENS.colors.footerMutedText,
  fontSize: '0.8125rem',
  lineHeight: 1.5,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '&:hover': { color: DESIGN_TOKENS.colors.footerText },
  '&:focus-visible': {
    outline: `2px solid ${DESIGN_TOKENS.colors.footerText}`,
    outlineOffset: 3,
  },
};

interface FooterLinkGroupProps {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}

const FooterLinkGroup = ({ title, links }: FooterLinkGroupProps) => (
  <Stack spacing={1.1}>
    <Typography variant="subtitle2" sx={{ color: 'common.white', fontWeight: 700, mb: 0.4 }}>
      {title}
    </Typography>
    {links.map((link) => (
      <Link key={link.label} href={link.href} sx={footerLinkSx}>
        {link.label}
      </Link>
    ))}
  </Stack>
);

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: DESIGN_TOKENS.colors.footerBackground,
        color: DESIGN_TOKENS.colors.footerText,
        pt: { xs: 5, md: 7 },
        pb: 2.5,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container columnSpacing={{ xs: 3, md: 5 }} rowSpacing={{ xs: 4, md: 3 }}>
          <Grid item xs={12} md={6} lg={6}>
            <Stack spacing={1.75} alignItems="flex-start">
              <Box
                component={NavLink}
                to="/"
                aria-label="ChasquiFly, ir al inicio"
                sx={{ display: 'inline-flex', textDecoration: 'none' }}
              >
                <Stack spacing={0.4}>
                  <Typography
                    component="span"
                    sx={{
                      color: DESIGN_TOKENS.colors.footerText,
                      fontSize: { xs: '2rem', sm: '2.25rem' },
                      fontWeight: 800,
                      letterSpacing: '-0.055em',
                      lineHeight: 0.95,
                    }}
                  >
                    Chasqui
                    <Box component="span" sx={{ color: '#E8C27D' }}>
                      Fly
                    </Box>
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      color: '#F7DFAF',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Tu mejor aliado en cada vuelo
                  </Typography>
                </Stack>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: DESIGN_TOKENS.colors.footerMutedText, lineHeight: 1.65, maxWidth: 320, fontSize: '0.8125rem' }}
              >
                Tu aliado para comparar, elegir y seguir cada vuelo con información clara y opciones que se adaptan a ti.
              </Typography>
              <Typography variant="caption" sx={{ color: DESIGN_TOKENS.colors.footerMutedText }}>
                © 2026 ChasquiFly. Todos los derechos reservados.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={4} md={2} lg={2}>
            <FooterLinkGroup title="Compañía" links={companyLinks} />
          </Grid>
          <Grid item xs={6} sm={4} md={2} lg={2}>
            <FooterLinkGroup title="Soporte" links={supportLinks} />
          </Grid>
          <Grid item xs={6} sm={4} md={2} lg={2}>
            <FooterLinkGroup title="Legal" links={legalLinks} />
          </Grid>
        </Grid>

        <Divider sx={{ mt: { xs: 4, md: 5 }, borderColor: 'rgba(255, 249, 246, 0.2)' }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ pt: 2.25 }}
        >
          <Typography variant="caption" sx={{ color: DESIGN_TOKENS.colors.footerMutedText }}>
            Vuela informado, viaja mejor.
          </Typography>
          <Stack direction="row" spacing={0.25}>
            <IconButton aria-label="Facebook" href="#facebook" size="small" sx={{ color: DESIGN_TOKENS.colors.footerMutedText, '&:hover': { color: 'common.white' } }}>
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="Twitter" href="#twitter" size="small" sx={{ color: DESIGN_TOKENS.colors.footerMutedText, '&:hover': { color: 'common.white' } }}>
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="Instagram" href="#instagram" size="small" sx={{ color: DESIGN_TOKENS.colors.footerMutedText, '&:hover': { color: 'common.white' } }}>
              <InstagramIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
