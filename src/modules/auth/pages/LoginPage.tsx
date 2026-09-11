import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Divider,
  Link,
} from "@mui/material";
import LoginForm from "../components/LoginForm";
import SocialLoginButtons from "../components/SocialLoginButtons";
import { AuthResponse } from "../../../types/auth.types";

export interface LoginPageProps {
  onLoginSuccess?: (authData: AuthResponse) => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}) => {
  const navigate = useNavigate();

  const handleSuccess = (authData: AuthResponse) => {
    console.log("Login exitoso:", authData.user.email);
    if (onLoginSuccess) {
      onLoginSuccess(authData);
    } else {
      navigate("/");
    }
  };

  const handleGoToRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate("/register");
    }
  };

  const handleGoToForgotPassword = () => {
    if (onNavigateToForgotPassword) {
      onNavigateToForgotPassword();
    } else {
      navigate("/forgot-password");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        // Imagen de machupicchu con degradado oscuro para legibilidad
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1920&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 2, md: 3 },
        px: 2,
      }}
    >
      <Container
        maxWidth="xs"
        disableGutters
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            p: { xs: 2.5, sm: 3.5 },
            bgcolor: "background.paper",
            borderRadius: 4,
            border: 1,
            borderColor: "divider",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Stack spacing={2} alignItems="center">
            {/* Logo & Header Title */}
            <Stack
              spacing={1.5}
              alignItems="center"
              sx={{ textAlign: "center" }}
            >
              <Box
                component="a"
                href="#"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
                  </svg>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "secondary.main",
                    letterSpacing: "-0.02em",
                    fontSize: "1.35rem",
                  }}
                >
                  Chasqui
                  <Box component="span" sx={{ color: "primary.main" }}>
                    Fly
                  </Box>
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: "secondary.main",
                  fontWeight: 800,
                  fontSize: { xs: "1.4rem", md: "1.6rem" },
                }}
              >
                Iniciar sesión
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  maxWidth: 320,
                }}
              >
                Accede a tu cuenta para gestionar tus itinerarios, reservas y
                alertas.
              </Typography>
            </Stack>

            {/* Formulario React Hook Form + Zod */}
            <LoginForm
              onSuccess={handleSuccess}
              onForgotPasswordClick={handleGoToForgotPassword}
            />

            {/* Separador 'o continuar con' */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Divider sx={{ flexGrow: 1, borderColor: "divider" }} />
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontSize: "0.8125rem" }}
              >
                o continuar con
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: "divider" }} />
            </Box>

            {/* Social Logins */}
            <SocialLoginButtons
              onGoogleClick={() => console.log("Iniciar con Google")}
              onFacebookClick={() => console.log("Iniciar con Facebook")}
            />

            {/* Link a Registro */}
            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.875rem" }}
              >
                ¿No tienes una cuenta?
              </Typography>
              <Link
                component="button"
                type="button"
                underline="hover"
                onClick={handleGoToRegister}
                sx={{
                  color: "primary.main",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                Regístrate
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
