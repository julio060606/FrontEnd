import { Box } from '@mui/material';
import chasquiFlyLogo from '@/assets/chasquifly-logo.png';

export type BrandLogoVariant = 'navbar' | 'auth';

export interface BrandLogoProps {
  variant: BrandLogoVariant;
}

const logoHeights: Record<BrandLogoVariant, { xs: number; sm: number; md: number }> = {
  navbar: { xs: 58, sm: 64, md: 76 },
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
        transform: variant === 'navbar' ? 'scale(1.2)' : 'none',
        transformOrigin: 'center',
      }}
    />
  </Box>
);

export default BrandLogo;
