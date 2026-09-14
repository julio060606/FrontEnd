import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { FlightChronologyEvent } from '../../../types/tracker.types';

export interface FlightChronologyProps {
  events: FlightChronologyEvent[];
}

export const FlightChronology: React.FC<FlightChronologyProps> = ({ events }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: { xs: 3, sm: 4 },
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2DBD7',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography
        sx={{
          color: '#1B2A4A',
          fontWeight: 800,
          fontSize: '18px',
          fontFamily: 'Inter',
          mb: 3,
        }}
      >
        Historial y Cronología del Vuelo
      </Typography>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const isCurrent = event.status === 'current';
          const isUpcoming = event.status === 'upcoming';

          return (
            <Box
              key={event.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                position: 'relative',
              }}
            >
              {/* 1. Columna Hora */}
              <Box sx={{ width: { xs: 65, sm: 90 }, flexShrink: 0, pt: '2px' }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: isCurrent ? 700 : isUpcoming ? 500 : 600,
                    color: isCurrent ? '#10B981' : isUpcoming ? '#9E9490' : '#6B615E',
                  }}
                >
                  {event.time}
                </Typography>
              </Box>

              {/* 2. Columna Timeline (Línea Continua y Nodo Centrado) */}
              <Box
                sx={{
                  width: 32,
                  display: 'flex',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  alignSelf: 'stretch',
                }}
              >
                {/* Línea vertical continua */}
                {!isLast && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 14,
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '2px',
                      bgcolor: '#E2DBD7',
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Nodo / Bullet */}
                <Box
                  sx={{
                    mt: isCurrent ? '2px' : '4px',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isCurrent ? (
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        bgcolor: '#10B981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 4px #DCFCE7',
                      }}
                    />
                  ) : isUpcoming ? (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: '#D0C7C2',
                        borderRadius: '50%',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        bgcolor: '#A01B2D',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* 3. Columna Descripción del Evento */}
              <Box
                sx={{
                  flex: 1,
                  pl: 2,
                  pb: isLast ? 0 : 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: isCurrent ? 700 : isUpcoming ? 500 : 600,
                    color: isCurrent ? '#10B981' : isUpcoming ? '#9E9490' : '#1B2A4A',
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    color: isUpcoming ? '#9E9490' : '#6B615E',
                    lineHeight: 1.45,
                    mt: 0.5,
                  }}
                >
                  {event.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default FlightChronology;
