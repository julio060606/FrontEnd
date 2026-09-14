import React from "react";
import { Stack, Button, Box, Typography } from "@mui/material";

export interface SocialLoginButtonsProps {
  onGoogleClick?: () => void;
  onFacebookClick?: () => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleClick,
  onFacebookClick,
}) => {
  return (
    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
      {/* Botón Google */}
      <Button
        variant="outlined"
        fullWidth
        onClick={onGoogleClick}
        sx={{
          py: 1.25,
          borderRadius: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "secondary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "customBackgrounds.appBase",
            borderColor: "secondary.light",
          },
        }}
      >
        {/* Google G Icon */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
            />
          </svg>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "secondary.main",
            fontSize: "0.875rem",
          }}
        >
          Google
        </Typography>
      </Button>

      {/* Botón Facebook */}
      <Button
        variant="outlined"
        fullWidth
        onClick={onFacebookClick}
        sx={{
          py: 1.25,
          borderRadius: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "secondary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "customBackgrounds.appBase",
            borderColor: "secondary.light",
          },
        }}
      >
        {/* FACEBOOK Icon nuevo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "secondary.main",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#1877F2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "secondary.main",
            fontSize: "0.875rem",
          }}
        >
          Facebook
        </Typography>
      </Button>
    </Stack>
  );
};

export default SocialLoginButtons;
