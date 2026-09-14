import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Switch,
  Paper,
  Grid,
} from '@mui/material';

import { trackerService } from '../../../services/trackerService';

export interface NotificationSettings {
  notifyStatusChanges: boolean;
  notifyDelays: boolean;
  notifyArrival: boolean;
}

export interface FlightNotificationTogglesProps {
  initialSettings?: NotificationSettings;
  onChange?: (newSettings: NotificationSettings) => void;
}

export const FlightNotificationToggles: React.FC<FlightNotificationTogglesProps> = ({
  initialSettings = {
    notifyStatusChanges: true,
    notifyDelays: true,
    notifyArrival: false,
  },
  onChange,
}) => {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);

  const handleToggle = async (key: keyof NotificationSettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(updated);
    onChange?.(updated);

    try {
      await trackerService.configureAlerts({
        notifyStatusChanges: updated.notifyStatusChanges,
        notifyDelays: updated.notifyDelays,
        notifyArrival: updated.notifyArrival,
      });
    } catch (error) {
      console.error('Error al actualizar configuración de alertas:', error);
    }
  };

  const notificationOptions = [
    {
      key: 'notifyStatusChanges' as keyof NotificationSettings,
      title: 'Notificar cambios de estado',
      description: 'Alertas inmediatas en cambios generales de despegue y aterrizaje.',
    },
    {
      key: 'notifyDelays' as keyof NotificationSettings,
      title: 'Notificar retrasos',
      description: 'Avisos urgentes si el horario estimado sufre variaciones mayores a 10 min.',
    },
    {
      key: 'notifyArrival' as keyof NotificationSettings,
      title: 'Notificar llegada',
      description: 'Confirmación inmediata de arribo y gate asignado en destino.',
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: { xs: 2.5, sm: 3.5, md: 4 },
        bgcolor: 'background.paper',
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: 'secondary.main',
              fontWeight: 800,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
            }}
          >
            Notificaciones
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 0.5 }}>
            Recibe alertas sobre cambios en el estado de este vuelo directamente en tus dispositivos.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {notificationOptions.map((item) => (
            <Grid item xs={12} md={4} key={item.key}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  p: 2.5,
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.light',
                  },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      display: 'block',
                      mt: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>

                <Switch
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                  sx={{
                    width: 44,
                    height: 24,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                      padding: '2px',
                      '&.Mui-checked': {
                        transform: 'translateX(20px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#A01B2D',
                          opacity: 1,
                          border: 0,
                        },
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      width: 20,
                      height: 20,
                      boxShadow: 'none',
                      backgroundColor: '#FFFFFF',
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 12,
                      backgroundColor: '#E2DBD7',
                      opacity: 1,
                      transition: 'background-color 0.2s',
                    },
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
};

export default FlightNotificationToggles;
