import { createTheme, alpha, ThemeOptions } from '@mui/material/styles';

/**
 * TypeScript Module Augmentation
 * Extiende las interfaces de MUI para soportar tokens personalizados del diseño en Figma (ChasquiFly).
 */
declare module '@mui/material/styles' {
  interface Palette {
    customBackgrounds: {
      appBase: string;
      card: string;
      input: string;
    };
    customBorders: {
      main: string;
    };
    soft: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  }
  interface PaletteOptions {
    customBackgrounds?: {
      appBase?: string;
      card?: string;
      input?: string;
    };
    customBorders?: {
      main?: string;
    };
    soft?: {
      primary?: string;
      secondary?: string;
      success?: string;
      warning?: string;
      error?: string;
      info?: string;
    };
  }

  interface TypeText {
    tertiary?: string;
  }
}

// ----------------------------------------------------------------------
// DESIGN TOKENS (FIGMA EXTRACT)
// ----------------------------------------------------------------------

export const DESIGN_TOKENS = {
  colors: {
    // Brand Colors
    primaryMain: '#A01B2D', // Rojo ChasquiFly
    primaryDark: '#801524',
    primaryLight: '#FEF1EF',
    primarySoft: '#FDE8EC',

    // Brand surfaces for the remastered public layout
    brandIvory: '#FFFCF8',
    footerBackground: '#941A2A',
    footerText: '#FFF9F6',
    footerMutedText: '#E9B7BF',
    heroOverlay: 'rgba(27, 42, 74, 0.58)',

    secondaryMain: '#1B2A4A', // Azul Marino / Textos principales
    secondaryDark: '#121C31',
    secondaryLight: '#2A3F6D',

    // Neutral & Backgrounds
    appBase: '#FAF5F0', // Gris cálido fondo general
    cardBg: '#FFFFFF', // Blanco tarjetas
    inputBg: '#F3F3F3', // Fondo de campos
    border: '#E2DBD7', // Líneas divisorias / bordes

    // Typography
    textPrimary: '#1B2A4A', // Azul Marino profundo
    textSecondary: '#6B615E', // Gris pizarra oscuro
    textTertiary: '#9E9490', // Gris pizarra suave / disabled

    // Semantics & Status
    successMain: '#10B981', // Verde esmeralda (A tiempo / Directo)
    successDark: '#15803D',
    successSoft: '#DCFCE7',

    warningMain: '#F97316', // Naranja / Ámbar (IA Recomendación / Alertas)
    warningDark: '#C2410C',
    warningSoft: 'rgba(249, 115, 22, 0.15)',

    errorMain: '#EF4444', // Rojo carmesí (Cancelado / Error)
    errorDark: '#B91C1C',
    errorSoft: '#FEE2E2',

    infoMain: '#2563EB', // Azul progreso / Embarque
    infoDark: '#1D4ED8',
    infoSoft: '#DBEAFE',
  },
  radius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
  },
  shadows: {
    card: '0px 4px 20px rgba(0, 0, 0, 0.05)',
    cardHover: '0px 8px 30px rgba(0, 0, 0, 0.08)',
    modal: '0px 12px 40px rgba(27, 42, 74, 0.12)',
  },
};

// ----------------------------------------------------------------------
// THEME CONFIGURATION
// ----------------------------------------------------------------------

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: DESIGN_TOKENS.colors.primaryMain,
      dark: DESIGN_TOKENS.colors.primaryDark,
      light: DESIGN_TOKENS.colors.primaryLight,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: DESIGN_TOKENS.colors.secondaryMain,
      dark: DESIGN_TOKENS.colors.secondaryDark,
      light: DESIGN_TOKENS.colors.secondaryLight,
      contrastText: '#FFFFFF',
    },
    text: {
      primary: DESIGN_TOKENS.colors.textPrimary,
      secondary: DESIGN_TOKENS.colors.textSecondary,
      disabled: DESIGN_TOKENS.colors.textTertiary,
      tertiary: DESIGN_TOKENS.colors.textTertiary,
    },
    background: {
      default: DESIGN_TOKENS.colors.appBase,
      paper: DESIGN_TOKENS.colors.cardBg,
    },
    divider: DESIGN_TOKENS.colors.border,
    success: {
      main: DESIGN_TOKENS.colors.successMain,
      dark: DESIGN_TOKENS.colors.successDark,
      light: DESIGN_TOKENS.colors.successSoft,
      contrastText: '#FFFFFF',
    },
    warning: {
      main: DESIGN_TOKENS.colors.warningMain,
      dark: DESIGN_TOKENS.colors.warningDark,
      light: DESIGN_TOKENS.colors.warningSoft,
      contrastText: '#FFFFFF',
    },
    error: {
      main: DESIGN_TOKENS.colors.errorMain,
      dark: DESIGN_TOKENS.colors.errorDark,
      light: DESIGN_TOKENS.colors.errorSoft,
      contrastText: '#FFFFFF',
    },
    info: {
      main: DESIGN_TOKENS.colors.infoMain,
      dark: DESIGN_TOKENS.colors.infoDark,
      light: DESIGN_TOKENS.colors.infoSoft,
      contrastText: '#FFFFFF',
    },
    customBackgrounds: {
      appBase: DESIGN_TOKENS.colors.appBase,
      card: DESIGN_TOKENS.colors.cardBg,
      input: DESIGN_TOKENS.colors.inputBg,
    },
    customBorders: {
      main: DESIGN_TOKENS.colors.border,
    },
    soft: {
      primary: DESIGN_TOKENS.colors.primarySoft,
      secondary: alpha(DESIGN_TOKENS.colors.secondaryMain, 0.08),
      success: DESIGN_TOKENS.colors.successSoft,
      warning: DESIGN_TOKENS.colors.warningSoft,
      error: DESIGN_TOKENS.colors.errorSoft,
      info: DESIGN_TOKENS.colors.infoSoft,
    },
  },

  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: 800,
      lineHeight: 1.2,
      color: DESIGN_TOKENS.colors.textPrimary,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.75rem', // 28px
      fontWeight: 700,
      lineHeight: 1.3,
      color: DESIGN_TOKENS.colors.textPrimary,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.375rem', // 22px
      fontWeight: 700,
      lineHeight: 1.35,
      color: DESIGN_TOKENS.colors.textPrimary,
    },
    h4: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.4,
      color: DESIGN_TOKENS.colors.textPrimary,
    },
    h5: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.45,
      color: DESIGN_TOKENS.colors.textPrimary,
    },
    h6: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1.5,
      color: DESIGN_TOKENS.colors.textPrimary,
    },
    subtitle1: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.5,
      color: DESIGN_TOKENS.colors.textSecondary,
    },
    subtitle2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.5,
      color: DESIGN_TOKENS.colors.textSecondary,
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.6,
      color: DESIGN_TOKENS.colors.textPrimary,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.6,
      color: DESIGN_TOKENS.colors.textSecondary,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none', // Sin mayúsculas forzadas
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
      lineHeight: 1.4,
      color: DESIGN_TOKENS.colors.textTertiary,
    },
    overline: {
      fontSize: '0.6875rem', // 11px
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: DESIGN_TOKENS.colors.textSecondary,
    },
  },

  shape: {
    borderRadius: DESIGN_TOKENS.radius.sm, // 8px por defecto
  },

  components: {
    // ----------------- BOTONES -----------------
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.radius.sm, // 8px
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          backgroundColor: DESIGN_TOKENS.colors.primaryMain,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: DESIGN_TOKENS.colors.primaryDark,
            boxShadow: '0 4px 12px rgba(160, 27, 45, 0.25)',
          },
        },
        containedSecondary: {
          backgroundColor: DESIGN_TOKENS.colors.secondaryMain,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: DESIGN_TOKENS.colors.secondaryDark,
            boxShadow: '0 4px 12px rgba(27, 42, 74, 0.2)',
          },
        },
        outlined: {
          borderColor: DESIGN_TOKENS.colors.border,
          color: DESIGN_TOKENS.colors.textPrimary,
          '&:hover': {
            borderColor: DESIGN_TOKENS.colors.primaryMain,
            backgroundColor: DESIGN_TOKENS.colors.primaryLight,
          },
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
          borderRadius: DESIGN_TOKENS.radius.sm,
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.8125rem',
          borderRadius: DESIGN_TOKENS.radius.xs,
        },
      },
    },

    // ----------------- TARJETAS & PAPEL -----------------
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.radius.lg, // 16px para Cards principales
          backgroundColor: DESIGN_TOKENS.colors.cardBg,
          border: `1px solid ${DESIGN_TOKENS.colors.border}`,
          boxShadow: DESIGN_TOKENS.shadows.card,
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: DESIGN_TOKENS.shadows.cardHover,
            borderColor: alpha(DESIGN_TOKENS.colors.primaryMain, 0.2),
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.radius.md, // 12px
          backgroundImage: 'none',
        },
        elevation0: {
          border: `1px solid ${DESIGN_TOKENS.colors.border}`,
          boxShadow: DESIGN_TOKENS.shadows.card,
        },
        elevation1: {
          boxShadow: DESIGN_TOKENS.shadows.card,
          border: `1px solid ${DESIGN_TOKENS.colors.border}`,
        },
      },
    },

    // ----------------- CAMPOS DE FORMULARIO (INPUTS) -----------------
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.radius.sm, // 8px
          backgroundColor: DESIGN_TOKENS.colors.inputBg, // #F3F3F3
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: DESIGN_TOKENS.colors.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: DESIGN_TOKENS.colors.secondaryMain,
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: DESIGN_TOKENS.colors.primaryMain,
              borderWidth: '2px',
            },
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: DESIGN_TOKENS.colors.errorMain,
          },
        },
        input: {
          padding: '12px 14px',
          color: DESIGN_TOKENS.colors.textPrimary,
          fontWeight: 500,
          '&::placeholder': {
            color: DESIGN_TOKENS.colors.textTertiary,
            opacity: 1,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: DESIGN_TOKENS.colors.textSecondary,
          fontWeight: 500,
          '&.Mui-focused': {
            color: DESIGN_TOKENS.colors.primaryMain,
          },
        },
      },
    },

    // ----------------- CHIPS Y BADGES (ESTADOS) -----------------
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_TOKENS.radius.xs, // 6px
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        colorSuccess: {
          backgroundColor: DESIGN_TOKENS.colors.successSoft,
          color: DESIGN_TOKENS.colors.successDark,
          border: `1px solid ${alpha(DESIGN_TOKENS.colors.successMain, 0.3)}`,
        },
        colorWarning: {
          backgroundColor: DESIGN_TOKENS.colors.warningSoft,
          color: DESIGN_TOKENS.colors.warningDark,
          border: `1px solid ${alpha(DESIGN_TOKENS.colors.warningMain, 0.4)}`,
        },
        colorError: {
          backgroundColor: DESIGN_TOKENS.colors.errorSoft,
          color: DESIGN_TOKENS.colors.errorDark,
          border: `1px solid ${alpha(DESIGN_TOKENS.colors.errorMain, 0.3)}`,
        },
        colorInfo: {
          backgroundColor: DESIGN_TOKENS.colors.infoSoft,
          color: DESIGN_TOKENS.colors.infoDark,
          border: `1px solid ${alpha(DESIGN_TOKENS.colors.infoMain, 0.3)}`,
        },
      },
    },

    // ----------------- MODALES Y DIÁLOGOS -----------------
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: DESIGN_TOKENS.radius.lg, // 16px
          boxShadow: DESIGN_TOKENS.shadows.modal,
          border: `1px solid ${DESIGN_TOKENS.colors.border}`,
          padding: '8px',
        },
      },
    },

    // ----------------- TABLAS (FIDS LIVE BOARD) -----------------
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`,
          padding: '14px 16px',
          color: DESIGN_TOKENS.colors.textPrimary,
        },
        head: {
          backgroundColor: DESIGN_TOKENS.colors.inputBg,
          fontWeight: 700,
          color: DESIGN_TOKENS.colors.textSecondary,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        },
      },
    },

    // ----------------- APP BAR (HEADER) -----------------
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: DESIGN_TOKENS.colors.secondaryMain, // Azul Marino
          color: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    // ----------------- DIVIDERS -----------------
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: DESIGN_TOKENS.colors.border,
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
export default theme;
