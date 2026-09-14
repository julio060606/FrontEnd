import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Paper,
} from '@mui/material';
import { FlightFilterState, TimeOfDay } from '../../../types/flight.types';

export interface FilterSidebarProps {
  onFiltersChange?: (filters: FlightFilterState) => void;
  initialFilters?: Partial<FlightFilterState>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFiltersChange,
  initialFilters,
}) => {
  const [stops, setStops] = useState<number[]>(initialFilters?.stops ?? []);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange ?? [80, 500]
  );
  const [airlines, setAirlines] = useState<string[]>(
    initialFilters?.airlines ?? []
  );
  const [departureTimes, setDepartureTimes] = useState<TimeOfDay[]>(
    initialFilters?.departureTimes ?? []
  );

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.stops !== undefined) setStops(initialFilters.stops);
      if (initialFilters.priceRange !== undefined) setPriceRange(initialFilters.priceRange);
      if (initialFilters.airlines !== undefined) setAirlines(initialFilters.airlines);
      if (initialFilters.departureTimes !== undefined) setDepartureTimes(initialFilters.departureTimes);
    }
  }, [initialFilters]);

  const notifyChange = (updated: Partial<FlightFilterState>) => {
    onFiltersChange?.({
      stops,
      priceRange,
      airlines,
      departureTimes,
      ...updated,
    });
  };

  const handleStopToggle = (stopVal: number) => {
    const nextStops = stops.includes(stopVal)
      ? stops.filter((s) => s !== stopVal)
      : [...stops, stopVal];
    setStops(nextStops);
    notifyChange({ stops: nextStops });
  };

  const handleAirlineToggle = (airlineName: string) => {
    const nextAirlines = airlines.includes(airlineName)
      ? airlines.filter((a) => a !== airlineName)
      : [...airlines, airlineName];
    setAirlines(nextAirlines);
    notifyChange({ airlines: nextAirlines });
  };

  const handleTimeToggle = (timeVal: TimeOfDay) => {
    const nextTimes = departureTimes.includes(timeVal)
      ? departureTimes.filter((t) => t !== timeVal)
      : [...departureTimes, timeVal];
    setDepartureTimes(nextTimes);
    notifyChange({ departureTimes: nextTimes });
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    const val = newValue as [number, number];
    setPriceRange(val);
    notifyChange({ priceRange: val });
  };

  const handleResetFilters = () => {
    const defaultStops: number[] = [];
    const defaultRange: [number, number] = [80, 500];
    const defaultAirlines: string[] = [];
    const defaultTimes: TimeOfDay[] = [];

    setStops(defaultStops);
    setPriceRange(defaultRange);
    setAirlines(defaultAirlines);
    setDepartureTimes(defaultTimes);

    onFiltersChange?.({
      stops: defaultStops,
      priceRange: defaultRange,
      airlines: defaultAirlines,
      departureTimes: defaultTimes,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: '100%', md: 280 },
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Stack spacing={2.5}>
        {/* Header: Filtros y Limpiar Todo */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 800, fontSize: '1rem' }}>
            Filtros
          </Typography>
          <Button
            variant="text"
            color="primary"
            onClick={handleResetFilters}
            sx={{
              p: 0,
              minWidth: 'auto',
              fontSize: '0.8125rem',
              fontWeight: 600,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Limpiar todo
          </Button>
        </Stack>

        <Divider />

        {/* 1. Filtro de Escalas */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>
            Escalas
          </Typography>
          <FormGroup>
            {[
              { label: 'Directo', val: 0, price: 'S/. 120' },
              { label: '1 escala', val: 1, price: 'S/. 180' },
              { label: '2+ escalas', val: 2, price: 'S/. 250' },
            ].map((item) => (
              <Box
                key={`stop-${item.val}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.25,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stops.includes(item.val)}
                      onChange={() => handleStopToggle(item.val)}
                      color="primary"
                      size="small"
                      sx={{ p: 0.5 }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'secondary.main', fontSize: '0.8125rem' }}>
                      {item.label}
                    </Typography>
                  }
                  sx={{ mr: 0 }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {item.price}
                </Typography>
              </Box>
            ))}
          </FormGroup>
        </Stack>

        <Divider />

        {/* 2. Filtro de Precio Máximo */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>
            Precio máximo
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
              Rango:
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.8125rem' }}>
              S/. {priceRange[0]} – S/. {priceRange[1]}
            </Typography>
          </Stack>

          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={80}
              max={500}
              step={10}
              color="primary"
              size="small"
              sx={{
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                },
                '& .MuiSlider-track': {
                  height: 6,
                },
                '& .MuiSlider-rail': {
                  height: 6,
                  bgcolor: 'divider',
                },
              }}
            />
          </Box>
        </Stack>

        <Divider />

        {/* 3. Filtro de Aerolíneas */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>
            Aerolíneas
          </Typography>
          <FormGroup>
            {[
              { name: 'LATAM', price: 'S/. 145' },
              { name: 'Sky Airline', price: 'S/. 120' },
              { name: 'JetSMART', price: 'S/. 135' },
              { name: 'Star Perú', price: 'S/. 160' },
            ].map((airline) => (
              <Box
                key={airline.name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.25,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={airlines.includes(airline.name)}
                      onChange={() => handleAirlineToggle(airline.name)}
                      color="primary"
                      size="small"
                      sx={{ p: 0.5 }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: 'secondary.main', fontSize: '0.8125rem' }}>
                      {airline.name}
                    </Typography>
                  }
                  sx={{ mr: 0 }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {airline.price}
                </Typography>
              </Box>
            ))}
          </FormGroup>
        </Stack>

        <Divider />

        {/* 4. Filtro de Horario de Salida */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>
            Horario de salida
          </Typography>
          <FormGroup>
            {[
              { label: 'Mañana (05:00 - 12:00)', val: 'MORNING' as TimeOfDay },
              { label: 'Tarde (12:00 - 18:00)', val: 'AFTERNOON' as TimeOfDay },
              { label: 'Noche (18:00 - 24:00)', val: 'NIGHT' as TimeOfDay },
            ].map((timeOption) => (
              <FormControlLabel
                key={timeOption.val}
                control={
                  <Checkbox
                    checked={departureTimes.includes(timeOption.val)}
                    onChange={() => handleTimeToggle(timeOption.val)}
                    color="primary"
                    size="small"
                    sx={{ p: 0.5 }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'secondary.main', fontSize: '0.8125rem' }}>
                    {timeOption.label}
                  </Typography>
                }
                sx={{ mr: 0, py: 0.25 }}
              />
            ))}
          </FormGroup>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FilterSidebar;
