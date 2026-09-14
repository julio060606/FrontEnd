import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Grid,
} from '@mui/material';

export interface FlightTrackerSearchProps {
  initialFlightNumber?: string;
  initialDate?: string;
  onSearch?: (flightNumber: string, date: string) => void;
  isLoading?: boolean;
}

export const FlightTrackerSearch: React.FC<FlightTrackerSearchProps> = ({
  initialFlightNumber = 'LA 2045',
  initialDate = '15 Sep 2025',
  onSearch,
  isLoading = false,
}) => {
  const [flightNumber, setFlightNumber] = useState(initialFlightNumber);
  const [date, setDate] = useState(initialDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(flightNumber, date);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        width: '100%',
        p: { xs: 2.5, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 4,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Grid container spacing={2} alignItems="flex-end">
        {/* Campo Número de Vuelo */}
        <Grid item xs={12} sm={5} md={5}>
          <Stack spacing={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
              Número de vuelo
            </Typography>
            <TextField
              fullWidth
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
              placeholder="Ej. LA 2045, H2 5110"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ color: 'primary.main', display: 'flex' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
                      </svg>
                    </Box>
                  </InputAdornment>
                ),
                sx: { fontWeight: 600, color: 'secondary.main' },
              }}
            />
          </Stack>
        </Grid>

        {/* Campo Fecha */}
        <Grid item xs={12} sm={4} md={4}>
          <Stack spacing={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
              Fecha
            </Typography>
            <TextField
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Fecha del vuelo"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </Box>
                  </InputAdornment>
                ),
                sx: { fontWeight: 500, color: 'secondary.main' },
              }}
            />
          </Stack>
        </Grid>

        {/* Botón Submit */}
        <Grid item xs={12} sm={3} md={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            endIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            }
            sx={{
              height: 48,
              px: { xs: 2, sm: 4.5 },
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 1,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Rastrear vuelo
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FlightTrackerSearch;
