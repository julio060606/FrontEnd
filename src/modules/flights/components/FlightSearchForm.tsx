import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, Card, CardContent, Grid, Button, Autocomplete, 
  TextField, ToggleButton, ToggleButtonGroup, Typography,
  InputAdornment, MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';

import { Airport, FlightSearchFormData, TripType, TravelClass } from '../../../types/flight.types';

// Mock Data para aeropuertos
export const MOCK_AIRPORTS: Airport[] = [
  { id: 1, iataCode: 'LIM', name: 'Aeropuerto Internacional Jorge Chávez', city: 'Lima', country: 'Perú' },
  { id: 2, iataCode: 'CUZ', name: 'Aeropuerto Alejandro Velasco Astete', city: 'Cusco', country: 'Perú' },
  { id: 3, iataCode: 'AQP', name: 'Aeropuerto Internacional Rodríguez Ballón', city: 'Arequipa', country: 'Perú' },
  { id: 4, iataCode: 'BOG', name: 'El Dorado', city: 'Bogotá', country: 'Colombia' },
  { id: 5, iataCode: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina' },
  { id: 6, iataCode: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
];

const searchSchema = z.object({
  tripType: z.enum(['ONE_WAY', 'ROUND_TRIP']),
  origin: z.object({
    id: z.number(),
    iataCode: z.string(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
  }, { required_error: 'Origen requerido' }),
  destination: z.object({
    id: z.number(),
    iataCode: z.string(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
  }, { required_error: 'Destino requerido' }),
  departureDate: z.date({ required_error: 'Fecha de salida requerida', invalid_type_error: 'Fecha inválida' }),
  returnDate: z.date().optional().nullable(),
  passengers: z.number().min(1, 'Mínimo 1 pasajero').max(9, 'Máximo 9 pasajeros'),
  travelClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS']),
}).refine((data) => {
  if (data.tripType === 'ROUND_TRIP' && !data.returnDate) {
    return false;
  }
  return true;
}, {
  message: 'Fecha de regreso es requerida para viajes ida y vuelta',
  path: ['returnDate'],
}).refine((data) => {
  if (data.tripType === 'ROUND_TRIP' && data.returnDate && data.departureDate) {
    return data.returnDate >= data.departureDate;
  }
  return true;
}, {
  message: 'La fecha de regreso no puede ser menor a la salida',
  path: ['returnDate'],
}).refine((data) => {
  if (data.origin && data.destination) {
    return data.origin.id !== data.destination.id;
  }
  return true;
}, {
  message: 'El origen y destino no pueden ser el mismo aeropuerto',
  path: ['destination'],
});

export const FlightSearchForm: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FlightSearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      tripType: 'ROUND_TRIP',
      origin: null,
      destination: null,
      departureDate: null,
      returnDate: null,
      passengers: 1,
      travelClass: 'ECONOMY'
    }
  });

  const tripType = watch('tripType');

  const onSubmit = (data: FlightSearchFormData) => {
    console.log('Búsqueda:', data);
    // TODO: Emitir evento o redireccionar a listado de resultados
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', maxWidth: 1000, margin: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              
              {/* Controles superiores */}
              <Grid item xs={12} display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <Controller
                  name="tripType"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      {...field}
                      exclusive
                      onChange={(_, val) => { if (val) field.onChange(val); }}
                      size="small"
                      sx={{ '& .Mui-selected': { bgcolor: '#FDE8EC !important', color: '#A01B2D !important' } }}
                    >
                      <ToggleButton value="ROUND_TRIP">Ida y Vuelta</ToggleButton>
                      <ToggleButton value="ONE_WAY">Solo Ida</ToggleButton>
                    </ToggleButtonGroup>
                  )}
                />
                
                <Controller
                  name="passengers"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      label="Pasajeros"
                      sx={{ width: 120, bgcolor: '#F3F3F3', borderRadius: '8px' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <MenuItem key={n} value={n}>{n} {n === 1 ? 'Pasajero' : 'Pasajeros'}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name="travelClass"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      label="Clase"
                      sx={{ width: 160, bgcolor: '#F3F3F3', borderRadius: '8px' }}
                    >
                      <MenuItem value="ECONOMY">Economy</MenuItem>
                      <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
                      <MenuItem value="BUSINESS">Business</MenuItem>
                      <MenuItem value="FIRST_CLASS">First Class</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              {/* Origen y Destino */}
              <Grid item xs={12} md={6} display="flex" gap={2}>
                <Controller
                  name="origin"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={MOCK_AIRPORTS}
                      getOptionLabel={(option) => `${option.city} (${option.iataCode})`}
                      value={value}
                      onChange={(_, newValue) => onChange(newValue)}
                      fullWidth
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Origen" 
                          error={!!errors.origin}
                          helperText={errors.origin?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <FlightTakeoffIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: '#F3F3F3', borderRadius: '8px' }}
                        />
                      )}
                    />
                  )}
                />
                
                <Controller
                  name="destination"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={MOCK_AIRPORTS}
                      getOptionLabel={(option) => `${option.city} (${option.iataCode})`}
                      value={value}
                      onChange={(_, newValue) => onChange(newValue)}
                      fullWidth
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Destino"
                          error={!!errors.destination}
                          helperText={errors.destination?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <FlightLandIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ bgcolor: '#F3F3F3', borderRadius: '8px' }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Fechas y Botón Buscar */}
              <Grid item xs={12} md={6} display="flex" gap={2}>
                <Controller
                  name="departureDate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      label="Fecha de Salida"
                      value={value}
                      onChange={onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.departureDate,
                          helperText: errors.departureDate?.message as string,
                          sx: { bgcolor: '#F3F3F3', borderRadius: '8px' }
                        }
                      }}
                    />
                  )}
                />

                {tripType === 'ROUND_TRIP' && (
                  <Controller
                    name="returnDate"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label="Fecha de Regreso"
                        value={value}
                        onChange={onChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.returnDate,
                            helperText: errors.returnDate?.message as string,
                            sx: { bgcolor: '#F3F3F3', borderRadius: '8px' }
                          }
                        }}
                      />
                    )}
                  />
                )}
                
                <Box alignSelf="stretch">
                   <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ 
                      bgcolor: '#A01B2D', 
                      '&:hover': { bgcolor: '#801524' },
                      height: '100%',
                      px: 4,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none'
                    }}
                    startIcon={<SearchIcon />}
                  >
                    Buscar
                  </Button>
                </Box>
              </Grid>

            </Grid>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};
