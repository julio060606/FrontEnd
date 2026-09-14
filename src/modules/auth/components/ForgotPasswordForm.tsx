import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../../../validations/auth.schema';
import { authService } from '../../../services/authService';

export interface ForgotPasswordFormProps {
  onSuccess?: (message: string) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      const result = await authService.forgotPassword(data);
      setSuccessMessage(result.message);
      onSuccess?.(result.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al procesar la solicitud.');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      <Stack spacing={1.75}>
        {/* Banner de error */}
        {errorMessage && (
          <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.85rem' }}>
            {errorMessage}
          </Alert>
        )}

        {/* Banner de éxito */}
        {successMessage && (
          <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.85rem' }}>
            {successMessage}
          </Alert>
        )}

        {/* Campo Correo Electrónico */}
        <Stack spacing={0.5}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8125rem' }}>
            Correo electrónico registrado
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                placeholder="ejemplo@correo.com"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Stack>

        {/* Botón Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={isSubmitting}
          sx={{
            py: 1.1,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: 1,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
          ) : (
            'Enviar enlace de recuperación'
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default ForgotPasswordForm;
