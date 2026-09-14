import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  Paper,
  Drawer,
  IconButton,
  Skeleton,
} from '@mui/material';
import SearchSummaryBar from '../components/SearchSummaryBar';
import FilterSidebar from '../components/FilterSidebar';
import FlightCard from '../components/FlightCard';
import ComparisonSelectionBar from '../components/ComparisonSelectionBar';
import { flightService } from '../../../services/flightService';
import {
  FlightItem,
  FlightFilterState,
  SearchQueryParams,
  SortOption,
} from '../../../types/flight.types';

export const SearchResultsPage: React.FC = () => {
  const maxComparisonFlights = 2;
  const navigate = useNavigate();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState<SearchQueryParams | undefined>(undefined);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [selectedFlights, setSelectedFlights] = useState<FlightItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortOption>('PRICE_ASC');
  const [filters, setFilters] = useState<FlightFilterState>({
    stops: [0],
    priceRange: [80, 500],
    airlines: ['LATAM', 'Sky Airline'],
    departureTimes: ['AFTERNOON'],
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const comparisonIds = [
      urlSearchParams.get('flightA'),
      urlSearchParams.get('flightB'),
    ].filter((flightId): flightId is string => Boolean(flightId));
    const uniqueComparisonIds = [...new Set(comparisonIds)].slice(0, maxComparisonFlights);

    if (uniqueComparisonIds.length === 0) {
      return () => {
        isMounted = false;
      };
    }

    const restoreComparisonSelection = async () => {
      const restoredFlights = await flightService.getFlightsByIds(uniqueComparisonIds);

      if (isMounted) {
        setSelectedFlights(restoredFlights);
      }
    };

    restoreComparisonSelection();

    return () => {
      isMounted = false;
    };
  }, [urlSearchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const params = await flightService.getCurrentSearchParams();
        const results = await flightService.searchFlights(params, filters, sortBy);

        if (isMounted) {
          setSearchParams(params);
          setFlights(results);
        }
      } catch (error) {
        console.error('Error al cargar vuelos:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [filters, sortBy]);

  const handleFiltersChange = (newFilters: FlightFilterState) => {
    setFilters(newFilters);
  };

  const handleFlightDetailsClick = (flight: FlightItem) => {
    console.log('Detalles del vuelo seleccionado:', flight.flightNumber, flight.airline.name);
  };

  const updateComparisonUrl = (selection: FlightItem[]) => {
    const nextSearchParams = new URLSearchParams(urlSearchParams);
    nextSearchParams.delete('flightA');
    nextSearchParams.delete('flightB');

    if (selection[0]) {
      nextSearchParams.set('flightA', selection[0].id);
    }

    if (selection[1]) {
      nextSearchParams.set('flightB', selection[1].id);
    }

    setUrlSearchParams(nextSearchParams, { replace: true });
  };

  const handleComparisonToggle = (flight: FlightItem) => {
    const isAlreadySelected = selectedFlights.some((item) => item.id === flight.id);
    const nextSelection = isAlreadySelected
      ? selectedFlights.filter((item) => item.id !== flight.id)
      : [...selectedFlights, flight].slice(0, maxComparisonFlights);

    setSelectedFlights(nextSelection);
    updateComparisonUrl(nextSelection);
  };

  const handleRemoveComparisonFlight = (flightId: string) => {
    const nextSelection = selectedFlights.filter((flight) => flight.id !== flightId);
    setSelectedFlights(nextSelection);
    updateComparisonUrl(nextSelection);
  };

  const handleClearComparisonSelection = () => {
    setSelectedFlights([]);
    updateComparisonUrl([]);
  };

  const handleCompareSelectedFlights = () => {
    if (selectedFlights.length !== maxComparisonFlights) {
      return;
    }

    const [flightA, flightB] = selectedFlights;
    navigate(`/compare?flightA=${encodeURIComponent(flightA.id)}&flightB=${encodeURIComponent(flightB.id)}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Barra de Resumen de Búsqueda */}
      <SearchSummaryBar
        searchParams={searchParams}
        onEditSearchClick={() => console.log('Editar búsqueda')}
      />

      {/* 3. Contenedor Principal: Filtros + Resultados */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 3, md: 5 },
          pb: selectedFlights.length > 0 ? { xs: 24, md: 16 } : { xs: 3, md: 5 },
          px: { xs: 2, sm: 4, lg: 8 },
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {/* Botón de Filtros para vista Móvil */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setMobileFilterOpen(true)}
              startIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              }
              sx={{ bgcolor: 'background.paper', borderColor: 'divider', color: 'secondary.main', fontWeight: 600 }}
            >
              Mostrar Filtros
            </Button>
          </Box>

          <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
            {/* Panel Lateral de Filtros (Desktop) */}
            <Grid item xs={12} md={4} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <FilterSidebar
                initialFilters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </Grid>

            {/* Columna de Resultados */}
            <Grid item xs={12} md={8} lg={9}>
              <Stack spacing={2.5}>
                {/* Barra de Ordenamiento y Cantidad de Resultados */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    Comparamos <strong>{flights.length}</strong> opciones para tu ruta:
                  </Typography>

                  <Typography
                    variant="caption"
                    aria-live="polite"
                    sx={{ color: 'primary.main', fontWeight: 700 }}
                  >
                    Selección para comparar: {selectedFlights.length}/{maxComparisonFlights}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                      Ordenar por:
                    </Typography>

                    {[
                      { label: 'Precio más bajo', val: 'PRICE_ASC' as SortOption },
                      { label: 'Más rápido', val: 'DURATION_ASC' as SortOption },
                      { label: 'Mejor opción', val: 'BEST' as SortOption },
                    ].map((sortItem) => {
                      const isSelected = sortBy === sortItem.val;
                      return (
                        <Box
                          key={sortItem.val}
                          component="button"
                          onClick={() => setSortBy(sortItem.val)}
                          sx={{
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1,
                            border: 1,
                            borderColor: isSelected ? 'primary.main' : 'transparent',
                            bgcolor: isSelected ? 'customBackgrounds.appBase' : 'transparent',
                            color: isSelected ? 'primary.main' : 'text.secondary',
                            fontSize: '0.8125rem',
                            fontWeight: isSelected ? 700 : 500,
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        >
                          {sortItem.label}
                        </Box>
                      );
                    })}
                  </Stack>
                </Paper>

                {/* Listado de Tarjetas de Vuelo */}
                {isLoading ? (
                  Array.from(new Array(4)).map((_, i) => (
                    <Paper key={`skeleton-card-${i}`} sx={{ p: 3, borderRadius: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}><Skeleton height={40} /></Grid>
                        <Grid item xs={12} sm={6}><Skeleton height={40} /></Grid>
                        <Grid item xs={12} sm={3}><Skeleton height={40} /></Grid>
                      </Grid>
                    </Paper>
                  ))
                ) : flights.length === 0 ? (
                  <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 700, mb: 1 }}>
                      No encontramos vuelos con esos filtros
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Intenta ajustar el rango de precios o habilitar más aerolíneas.
                    </Typography>
                  </Paper>
                ) : (
                  flights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      isSelectedForComparison={selectedFlights.some(
                        (selectedFlight) => selectedFlight.id === flight.id,
                      )}
                      isComparisonSelectionDisabled={
                        selectedFlights.length >= maxComparisonFlights
                      }
                      onComparisonToggle={handleComparisonToggle}
                      onViewDetailsClick={handleFlightDetailsClick}
                    />
                  ))
                )}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Drawer de Filtros para Móviles */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{
          sx: {
            maxHeight: '85vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
            bgcolor: 'background.default',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>
            Filtros
          </Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </Box>
        <FilterSidebar
          initialFilters={filters}
          onFiltersChange={(newFilters) => {
            handleFiltersChange(newFilters);
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setMobileFilterOpen(false)}
          sx={{ mt: 2 }}
        >
          Aplicar Filtros
        </Button>
      </Drawer>

      <ComparisonSelectionBar
        selectedFlights={selectedFlights}
        onRemoveFlight={handleRemoveComparisonFlight}
        onClear={handleClearComparisonSelection}
        onCompare={handleCompareSelectedFlights}
      />

    </Box>
  );
};

export default SearchResultsPage;
