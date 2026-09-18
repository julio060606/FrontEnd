import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Autocomplete,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  MenuItem,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { Airport, FlightSearchFormData } from '../../../types/flight.types';
import { flightService } from '../../../services/flightService';

// Catálogo de Aeropuertos para el Autocomplete
export const MOCK_AIRPORTS: Airport[] = [
  { id: 1, iataCode: 'LIM', name: 'Aeropuerto Internacional Jorge Chávez', city: 'Lima', country: 'Perú' },
  { id: 2, iataCode: 'CUZ', name: 'Aeropuerto Alejandro Velasco Astete', city: 'Cusco', country: 'Perú' },
  { id: 3, iataCode: 'AQP', name: 'Aeropuerto Internacional Rodríguez Ballón', city: 'Arequipa', country: 'Perú' },
  { id: 4, iataCode: 'IQT', name: 'Aeropuerto Francisco Secada Vignetta', city: 'Iquitos', country: 'Perú' },
  { id: 5, iataCode: 'PIU', name: 'Aeropuerto Guillermo Concha Iberico', city: 'Piura', country: 'Perú' },
  { id: 6, iataCode: 'TRU', name: 'Aeropuerto Carlos Martínez de Pinillos', city: 'Trujillo', country: 'Perú' },
  { id: 7, iataCode: 'TCQ', name: 'Aeropuerto Coronel FAP Carlos Ciriani', city: 'Tacna', country: 'Perú' },
  { id: 8, iataCode: 'BOG', name: 'Aeropuerto Internacional El Dorado', city: 'Bogotá', country: 'Colombia' },
  { id: 9, iataCode: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA' },
];

const searchSchema = z
  .object({
    tripType: z.enum(['ONE_WAY', 'ROUND_TRIP']),
    origin: z
      .object(
        {
          id: z.number(),
          iataCode: z.string(),
          name: z.string(),
          city: z.string(),
          country: z.string(),
        },
        { required_error: 'Origen requerido' }
      )
      .nullable()
      .refine((val) => val !== null, { message: 'Selecciona un origen' }),
    destination: z
      .object(
        {
          id: z.number(),
          iataCode: z.string(),
          name: z.string(),
          city: z.string(),
          country: z.string(),
        },
        { required_error: 'Destino requerido' }
      )
      .nullable()
      .refine((val) => val !== null, { message: 'Selecciona un destino' }),
    departureDate: z
      .date({
        required_error: 'Fecha de salida requerida',
        invalid_type_error: 'Fecha inválida',
      })
      .nullable()
      .refine((val) => val !== null, { message: 'Fecha de salida requerida' }),
    returnDate: z.date().optional().nullable(),
    passengers: z.number().min(1, 'Mínimo 1 pasajero').max(9, 'Máximo 9 pasajeros'),
    travelClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS']),
  })
  .refine(
    (data) => {
      if (data.tripType === 'ROUND_TRIP' && !data.returnDate) {
        return false;
      }
      return true;
    },
    {
      message: 'Fecha de regreso es requerida para viajes ida y vuelta',
      path: ['returnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.tripType === 'ROUND_TRIP' && data.returnDate && data.departureDate) {
        return data.returnDate >= data.departureDate;
      }
      return true;
    },
    {
      message: 'La fecha de regreso no puede ser anterior a la salida',
      path: ['returnDate'],
    }
  )
  .refine(
    (data) => {
      if (data.origin && data.destination) {
        return data.origin.iataCode !== data.destination.iataCode;
      }
      return true;
    },
    {
      message: 'El origen y destino no pueden ser el mismo aeropuerto',
      path: ['destination'],
    }
  );

export interface FlightSearchFormProps {
  onSearchSubmit?: (data: FlightSearchFormData) => void;
  defaultOrigin?: Airport | null;
  defaultDestination?: Airport | null;
  originInputRef?: React.RefObject<HTMLInputElement>;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  onSearchSubmit,
  defaultOrigin = MOCK_AIRPORTS[0], // Lima (LIM)
  defaultDestination = MOCK_AIRPORTS[1], // Cusco (CUZ)
  originInputRef,
}) => {
  const navigate = useNavigate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FlightSearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      tripType: 'ROUND_TRIP',
      origin: defaultOrigin,
      destination: defaultDestination,
      departureDate: tomorrow,
      returnDate: nextWeek,
      passengers: 1,
      travelClass: 'ECONOMY',
    },
  });

  const tripType = watch('tripType');

  const onSubmit = (data: FlightSearchFormData) => {
    if (!data.origin || !data.destination) return;

    const depFormatted = data.departureDate
      ? data.departureDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
      : '15 Sep';

    const retFormatted = data.returnDate
      ? data.returnDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
      : undefined;

    // Actualizar el estado global del servicio de vuelos para que SearchResultsPage lo tome
    flightService.setCurrentSearchParams({
      origin: data.origin.city,
      originIata: data.origin.iataCode,
      destination: data.destination.city,
      destinationIata: data.destination.iataCode,
      departureDate: depFormatted,
      returnDate: data.tripType === 'ROUND_TRIP' ? retFormatted : undefined,
      passengers: data.passengers,
      travelClass: data.travelClass === 'ECONOMY' ? 'Económica' : data.travelClass,
      tripType: data.tripType,
    });

    onSearchSubmit?.(data);
    navigate('/flights');
  };

  const toInputDateValue = (d: Date | null | undefined): string => {
    if (!d || isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const fromInputDateValue = (str: string): Date | null => {
    if (!str) return null;
    const parsed = new Date(`${str}T12:00:00`);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: { xs: 2, md: 4 },
        boxShadow: (theme) =>
          theme.palette.mode === 'light'
            ? '0px 8px 30px rgba(0, 0, 0, 0.08)'
            : 'none',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        maxWidth: 1100,
        width: '100%',
        mx: 'auto',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4 } }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            {/* Controles superiores: Tipo de viaje, pasajeros, clase */}
            <Grid
              item
              xs={12}
              display="flex"
              gap={2}
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <Controller
                name="tripType"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    {...field}
                    exclusive
                    onChange={(_, val) => {
                      if (val) {
                        field.onChange(val);
                        if (val === 'ONE_WAY') {
                          setValue('returnDate', null);
                        }
                      }
                    }}
                    size="small"
                    sx={{
                      bgcolor: 'background.default',
                      borderRadius: 2,
                      p: 0.5,
                      border: 1,
                      borderColor: 'divider',
                      '& .MuiToggleButton-root': {
                        border: 'none',
                        borderRadius: 1.5,
                        px: 2,
                        py: 0.6,
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        textTransform: 'none',
                        color: 'text.secondary',
                      },
                      '& .Mui-selected': {
                        bgcolor: 'soft.primary !important',
                        color: 'primary.main !important',
                        fontWeight: 700,
                      },
                    }}
                  >
                    <ToggleButton value="ROUND_TRIP">Ida y vuelta</ToggleButton>
                    <ToggleButton value="ONE_WAY">Solo ida</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />

              <Box display="flex" gap={1.5} alignItems="center">
                <Controller
                  name="passengers"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      size="small"
                      label="Pasajeros"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      sx={{
                        minWidth: 130,
                        bgcolor: 'customBackgrounds.input',
                        borderRadius: 1,
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <MenuItem key={n} value={n}>
                          {n} {n === 1 ? 'Pasajero' : 'Pasajeros'}
                        </MenuItem>
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
                      sx={{
                        minWidth: 150,
                        bgcolor: 'customBackgrounds.input',
                        borderRadius: 1,
                      }}
                    >
                      <MenuItem value="ECONOMY">Económica</MenuItem>
                      <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
                      <MenuItem value="BUSINESS">Business</MenuItem>
                      <MenuItem value="FIRST_CLASS">First Class</MenuItem>
                    </TextField>
                  )}
                />
              </Box>
            </Grid>

            {/* Fila Principal: Origen, Destino, Fecha Ida, Fecha Retorno */}
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="origin"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={MOCK_AIRPORTS}
                    getOptionLabel={(option) => `${option.city} (${option.iataCode})`}
                    value={value}
                    isOptionEqualToValue={(option, val) => option.iataCode === val?.iataCode}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Origen"
                        inputRef={originInputRef}
                        error={!!errors.origin}
                        helperText={errors.origin?.message}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <FlightTakeoffIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                        sx={{ bgcolor: 'customBackgrounds.input', borderRadius: 1 }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name="destination"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={MOCK_AIRPORTS}
                    getOptionLabel={(option) => `${option.city} (${option.iataCode})`}
                    value={value}
                    isOptionEqualToValue={(option, val) => option.iataCode === val?.iataCode}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Destino"
                        error={!!errors.destination}
                        helperText={errors.destination?.message}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <FlightLandIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                        sx={{ bgcolor: 'customBackgrounds.input', borderRadius: 1 }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={tripType === 'ROUND_TRIP' ? 3 : 4.5}>
              <Controller
                name="departureDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    label="Fecha de salida"
                    type="date"
                    value={toInputDateValue(value)}
                    onChange={(e) => onChange(fromInputDateValue(e.target.value))}
                    error={!!errors.departureDate}
                    helperText={errors.departureDate?.message}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ bgcolor: 'customBackgrounds.input', borderRadius: 1 }}
                  />
                )}
              />
            </Grid>

            {tripType === 'ROUND_TRIP' && (
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="returnDate"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      label="Fecha de regreso"
                      type="date"
                      value={toInputDateValue(value)}
                      onChange={(e) => onChange(fromInputDateValue(e.target.value))}
                      error={!!errors.returnDate}
                      helperText={errors.returnDate?.message}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ bgcolor: 'customBackgrounds.input', borderRadius: 1 }}
                    />
                  )}
                />
              </Grid>
            )}

            {/* Fila Inferior: Nota informativa y Botón Buscar */}
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              sx={{ pt: 1 }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                  ✈️ Comparando en tiempo real entre más de 15 aerolíneas y agencias peruanas.
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SearchIcon />}
                sx={{
                  px: 4,
                  py: 1.4,
                  borderRadius: 1.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(160, 27, 45, 0.25)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Buscar vuelos
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default FlightSearchForm;
