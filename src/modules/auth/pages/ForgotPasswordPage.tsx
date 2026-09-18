import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Link,
  Button,
} from "@mui/material";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import BrandLogo from "@/components/branding/BrandLogo";

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        // Imagen con degradado oscuro para legibilidad
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.7)), url('https://upload.wikimedia.org/wikipedia/commons/1/14/Ciudad_de_Cusco.jpg')`,
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
            {/* Logo & Encabezado */}
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
                  fontSize: { xs: "1.35rem", md: "1.5rem" },
                }}
              >
                Recuperar contraseña
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  maxWidth: 340,
                }}
              >
                {isSubmitted
                  ? "Revisa tu bandeja de entrada o spam. Sigue las instrucciones del correo para restablecer tu contraseña."
                  : "Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecer tu acceso."}
              </Typography>
            </Stack>

            {/* Formulario o Botón de Retorno */}
            {!isSubmitted ? (
              <ForgotPasswordForm onSuccess={handleSuccess} />
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ py: 1.1, fontWeight: 700 }}
              >
                Volver a Iniciar Sesión
              </Button>
            )}

            {/* Link de retorno al Login */}
            {!isSubmitted && (
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
                  ¿Te acordaste de tu contraseña?
                </Typography>
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{
                    color: "primary.main",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  Inicia sesión
                </Link>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
