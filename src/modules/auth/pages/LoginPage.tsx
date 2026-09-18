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
import BrandLogo from "@/components/branding/BrandLogo";

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
              <Box component={RouterLink} to="/" aria-label="ChasquiFly, ir al inicio" sx={{ display: "flex", textDecoration: "none", mb: 1 }}>
                <BrandLogo variant="auth" />
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
