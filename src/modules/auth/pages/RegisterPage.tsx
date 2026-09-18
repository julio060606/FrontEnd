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
import RegisterForm from "../components/RegisterForm";
import SocialLoginButtons from "../components/SocialLoginButtons";
import BrandLogo from "@/components/branding/BrandLogo";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (userData: { userId: string; message: string }) => {
    console.log("Registro exitoso:", userData);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        // Imagen con degradado oscuro para legibilidad
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.7)), url('https://upload.wikimedia.org/wikipedia/commons/d/d7/Vinicunca_o_monta%C3%B1a_7_colores.jpg')`,
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
        maxWidth="sm"
        disableGutters
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 520,
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
                  fontSize: { xs: "1.4rem", md: "1.6rem" },
                }}
              >
                Crea tu cuenta
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  maxWidth: 360,
                }}
              >
                Únete a ChasquiFly para comparar tarifas de aerolíneas, seguir
                tus vuelos en vivo y recibir alertas inteligentes.
              </Typography>
            </Stack>

            {/* Social Logins */}
            <SocialLoginButtons
              onGoogleClick={() => console.log("Registrarse con Google")}
              onFacebookClick={() => console.log("Registrarse con Facebook")}
            />

            {/* Separador */}
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
                o regístrate con tu correo
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: "divider" }} />
            </Box>

            {/* Formulario de Registro */}
            <RegisterForm onSuccess={handleSuccess} />

            {/* Link a Login */}
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
                ¿Ya tienes una cuenta?
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
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
