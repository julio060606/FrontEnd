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
import { FlightFilterState, FlightItem, TimeOfDay } from '../../../types/flight.types';

export interface FilterSidebarProps {
  onFiltersChange?: (filters: FlightFilterState) => void;
  initialFilters?: Partial<FlightFilterState>;
  availableFlights?: FlightItem[];
  currencySymbol?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFiltersChange,
  initialFilters,
  availableFlights = [],
  currencySymbol = '$',
}) => {
  const [stops, setStops] = useState<number[]>(initialFilters?.stops ?? []);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange ?? [0, 500]
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
    const defaultRange: [number, number] = [0, 500];
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

  // Helper para calcular precio mínimo según escalas
  const getMinPriceForStops = (stopVal: number): string | null => {
    if (!availableFlights || availableFlights.length === 0) return null;
    const matching = availableFlights.filter((f) =>
      stopVal >= 2 ? f.stopsCount >= 2 : f.stopsCount === stopVal
    );
    if (matching.length === 0) return null;
    const min = Math.min(...matching.map((f) => f.price));
    return `desde ${currencySymbol} ${min % 1 === 0 ? min : min.toFixed(2)}`;
  };

  // Helper para calcular precio mínimo según aerolínea
  const getMinPriceForAirline = (airlineName: string): string | null => {
    if (!availableFlights || availableFlights.length === 0) return null;
    const sel = airlineName.toLowerCase();
    const matching = availableFlights.filter(
      (f) =>
        f.airline.name.toLowerCase().includes(sel) ||
        sel.includes(f.airline.name.toLowerCase()) ||
        (f.airline.code && sel.includes(f.airline.code.toLowerCase()))
    );
    if (matching.length === 0) return null;
    const min = Math.min(...matching.map((f) => f.price));
    return `desde ${currencySymbol} ${min % 1 === 0 ? min : min.toFixed(2)}`;
  };

  // Opciones de aerolíneas disponibles
  const airlineOptions = React.useMemo(() => {
    if (availableFlights && availableFlights.length > 0) {
      const map = new Map<string, string>();
      availableFlights.forEach((f) => {
        if (f.airline?.name && !map.has(f.airline.name)) {
          map.set(f.airline.name, f.airline.name);
        }
      });
      if (map.size > 0) {
        return Array.from(map.values()).map((name) => ({
          name,
          price: getMinPriceForAirline(name),
        }));
      }
    }
    return [
      { name: 'LATAM Airlines', price: getMinPriceForAirline('LATAM') },
      { name: 'Sky Airline', price: getMinPriceForAirline('Sky') },
      { name: 'JetSMART Perú', price: getMinPriceForAirline('JetSMART') },
    ];
  }, [availableFlights, currencySymbol]);

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
              { label: 'Directo', val: 0, price: getMinPriceForStops(0) },
              { label: '1 escala', val: 1, price: getMinPriceForStops(1) },
              { label: '2+ escalas', val: 2, price: getMinPriceForStops(2) },
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
                {item.price && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {item.price}
                  </Typography>
                )}
              </Box>
            ))}
          </FormGroup>
        </Stack>

        <Divider />

        {/* 2. Filtro de Rango de Precio */}
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>
            Rango de precio
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
              Rango:
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.8125rem' }}>
              {currencySymbol} {priceRange[0]} – {currencySymbol} {priceRange[1]}
            </Typography>
          </Stack>

          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
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
            {airlineOptions.map((airline) => (
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
                {airline.price && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {airline.price}
                  </Typography>
                )}
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
