import { Box } from '@mui/material';
import chasquiFlyLogo from '@/assets/chasquifly-logo.png';

export type BrandLogoVariant = 'navbar' | 'footer' | 'auth';

export interface BrandLogoProps {
  variant: BrandLogoVariant;
}

const logoHeights: Record<BrandLogoVariant, { xs: number; sm: number; md: number }> = {
  navbar: { xs: 44, sm: 48, md: 54 },
  footer: { xs: 62, sm: 68, md: 74 },
  auth: { xs: 76, sm: 84, md: 88 },
};

export const BrandLogo = ({ variant }: BrandLogoProps) => (
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 0,
      bgcolor: '#FFFFFF',
      borderRadius: 1,
      p: 0.35,
    }}
  >
    <Box
      component="img"
      src={chasquiFlyLogo}
      alt="ChasquiFly"
      sx={{
        display: 'block',
        height: logoHeights[variant],
        width: 'auto',
        objectFit: 'contain',
      }}
    />
  </Box>
);

export default BrandLogo;
