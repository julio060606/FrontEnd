import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { loginSchema, LoginFormValues } from "../../../validations/auth.schema";
import { authService } from "../../../services/authService";
import { AuthResponse } from "../../../types/auth.types";

export interface LoginFormProps {
  onSuccess?: (authData: AuthResponse) => void;
  onForgotPasswordClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPasswordClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setErrorMessage(null);
      const authData = await authService.login(data);
      onSuccess?.(authData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocurrió un error inesperado al iniciar sesión.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: "100%" }}
    >
      <Stack spacing={1.75}>
        {/* Error Alert Banner */}
        {errorMessage && (
          <Alert
            severity="error"
            sx={{ borderRadius: 1.5, fontSize: "0.85rem" }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* 1. Campo Correo Electrónico */}
        <Stack spacing={0.75}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.8125rem",
            }}
          >
            Correo electrónico
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="ejemplo@correo.com"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                size="small"
              />
            )}
          />
        </Stack>

        {/* 2. Campo Contraseña */}
        <Stack spacing={0.75}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.8125rem",
            }}
          >
            Contraseña
          </Typography>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="••••••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Alternar visibilidad de contraseña"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? (
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
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
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
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Stack>

        {/* 3. Recordarme y Olvido de Contraseña */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    color="primary"
                    size="small"
                    sx={{ p: 0.5 }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: "0.8125rem" }}
                  >
                    Recordarme
                  </Typography>
                }
                sx={{ mr: 0 }}
              />
            )}
          />

          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={onForgotPasswordClick}
            sx={{
              color: "primary.main",
              fontSize: "0.8125rem",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            ¿Olvidé mi contraseña?
          </Link>
        </Stack>

        {/* 4. Botón Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isSubmitting}
          sx={{
            py: 1.1,
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: 1,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
