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
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { SearchSummaryBar } from '../components/SearchSummaryBar';
import FilterSidebar from '../components/FilterSidebar';
import FlightCard from '../components/FlightCard';
import ComparisonSelectionBar from '../components/ComparisonSelectionBar';
import { flightService } from '../../../services/flightService';
import { tripService } from '../../../services/tripService';
import { authService } from '../../../services/authService';
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
  const [isSearchPersisted, setIsSearchPersisted] = useState<boolean>(false);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [selectedFlights, setSelectedFlights] = useState<FlightItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortOption>('PRICE_ASC');
  const [filters, setFilters] = useState<FlightFilterState>({
    stops: [],
    priceRange: [80, 500],
    airlines: [],
    departureTimes: [],
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [savedTripIds, setSavedTripIds] = useState<Set<string>>(new Set());
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'warning' | 'info' | 'error'>('info');

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
          setIsSearchPersisted(flightService.hasPersistedSearch());
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

  // Sincronizar vuelos guardados de Mis Viajes desde Supabase
  useEffect(() => {
    let isMounted = true;
    const syncSavedTrips = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        if (isMounted) setSavedTripIds(new Set());
        return;
      }
      try {
        const trips = await tripService.getUserTrips();
        if (isMounted) {
          const ids = new Set<string>(
            trips.map((t) => String(t.flight?.flightId || (t.flight as any)?.id || ''))
          );
          setSavedTripIds(ids);
        }
      } catch (e) {
        console.warn('Error al sincronizar viajes guardados:', e);
      }
    };

    syncSavedTrips();

    const handleTripsChange = () => syncSavedTrips();
    window.addEventListener('chasquifly:trips-change', handleTripsChange);
    window.addEventListener('chasquifly:auth-change', handleTripsChange);

    return () => {
      isMounted = false;
      window.removeEventListener('chasquifly:trips-change', handleTripsChange);
      window.removeEventListener('chasquifly:auth-change', handleTripsChange);
    };
  }, []);

  const handleSaveFlightToTrips = async (flight: FlightItem) => {
    const user = authService.getCurrentUser();
    if (!user) {
      setSnackbarMessage('Debes iniciar sesión para guardar vuelos en tu cuenta personal.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      window.dispatchEvent(new CustomEvent('chasquifly:open-login'));
      return;
    }

    try {
      await tripService.saveTrip(
        flight.id,
        `Vuelo guardado: ${flight.flightNumber} (${flight.originIata} ➔ ${flight.destinationIata})`
      );
      setSavedTripIds((prev) => new Set(prev).add(flight.id));
      setSnackbarMessage(`¡Vuelo ${flight.flightNumber} guardado en Mis Viajes exitosamente!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error('Error al guardar viaje:', err);
      setSnackbarMessage(err.message || 'Error al guardar el vuelo en Mis Viajes');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleFiltersChange = (newFilters: FlightFilterState) => {
    setFilters(newFilters);
  };

  const handleFlightDetailsClick = (flight: FlightItem) => {
    navigate(`/flights/${flight.id}`);
  };

  const handleResetFilters = () => {
    setFilters({
      stops: [],
      priceRange: [80, 500],
      airlines: [],
      departureTimes: [],
    });
  };

  const handleForgetSavedSearch = () => {
    flightService.clearPersistedSearch();
    setIsSearchPersisted(false);
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

    // Si ya está seleccionado, lo deseleccionamos
    if (isAlreadySelected) {
      const nextSelection = selectedFlights.filter((item) => item.id !== flight.id);
      setSelectedFlights(nextSelection);
      updateComparisonUrl(nextSelection);
      return;
    }

    // Validación 1: Máximo 2 opciones permitidas simultáneamente
    if (selectedFlights.length >= maxComparisonFlights) {
      setSnackbarMessage('Solo puedes comparar un máximo de 2 opciones simultáneamente. Deselecciona una para elegir otra.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    // Validación 2: Coherencia de ruta (Mismo origen y mismo destino)
    if (selectedFlights.length === 1) {
      const first = selectedFlights[0];
      if (
        first.originIata.toLowerCase() !== flight.originIata.toLowerCase() ||
        first.destinationIata.toLowerCase() !== flight.destinationIata.toLowerCase()
      ) {
        setSnackbarMessage(
          `Solo puedes comparar vuelos de la misma ruta (${first.originIata} ➔ ${first.destinationIata}). No es posible comparar rutas distintas.`
        );
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }
    }

    const nextSelection = [...selectedFlights, flight];
    setSelectedFlights(nextSelection);
    updateComparisonUrl(nextSelection);
    setSnackbarMessage(
      nextSelection.length === 2
        ? '¡Tus dos vuelos están listos para ser comparados!'
        : `Vuelo ${flight.flightNumber} agregado a la comparación. Selecciona uno más de la misma ruta.`
    );
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
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
        onEditSearchClick={() => navigate('/')}
        isSearchPersisted={isSearchPersisted}
        onForgetSavedSearch={handleForgetSavedSearch}
      />

      {/* Contenedor Principal: Filtros + Resultados */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 3, md: 4 },
          pb: selectedFlights.length > 0 ? { xs: 24, md: 16 } : { xs: 3, md: 4 },
          px: { xs: 2, sm: 4, lg: 6 },
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {/* Botón de Filtros para vista Móvil */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2.5 }}>
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
              sx={{
                bgcolor: 'background.paper',
                borderColor: 'divider',
                color: 'secondary.main',
                fontWeight: 700,
                py: 1.2,
                borderRadius: 2,
              }}
            >
              Filtros de Búsqueda {(filters.stops.length > 0 || filters.airlines.length > 0 || filters.departureTimes.length > 0) && '• Activos'}
            </Button>
          </Box>

          <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
            {/* Panel Lateral de Filtros (Desktop) */}
            <Grid item xs={12} md={4} lg={3.2} xl={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <FilterSidebar
                initialFilters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </Grid>

            {/* Columna de Resultados */}
            <Grid item xs={12} md={8} lg={8.8} xl={9}>
              <Stack spacing={2.5}>
                {/* Barra de Ordenamiento y Cantidad de Resultados */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <Typography
                    variant="caption"
                    aria-live="polite"
                    sx={{ color: 'primary.main', fontWeight: 700 }}
                  >
                    Selección para comparar: {selectedFlights.length}/{maxComparisonFlights}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Encontramos
                    </Typography>
                    <Chip
                      label={`${flights.length} vuelos`}
                      size="small"
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        height: 24,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      para tu ruta
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700, mr: 0.5 }}>
                      Ordenar:
                    </Typography>

                    {[
                      { label: 'Más económico', val: 'PRICE_ASC' as SortOption },
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
                            px: 1.75,
                            py: 0.75,
                            borderRadius: 2,
                            border: 1,
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            bgcolor: isSelected ? 'soft.primary' : 'background.paper',
                            color: isSelected ? 'primary.main' : 'text.secondary',
                            fontSize: '0.8125rem',
                            fontWeight: isSelected ? 700 : 500,
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
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
                    <Paper
                      key={`skeleton-card-${i}`}
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2 }} />
                            <Box sx={{ flex: 1 }}>
                              <Skeleton width="80%" height={24} />
                              <Skeleton width="50%" height={18} />
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                            <Skeleton width={60} height={35} />
                            <Skeleton width={120} height={20} />
                            <Skeleton width={60} height={35} />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
                            <Skeleton width={70} height={40} />
                            <Skeleton variant="rounded" width={110} height={40} sx={{ borderRadius: 1.5 }} />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                ) : flights.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 5, md: 8 },
                      textAlign: 'center',
                      borderRadius: 3,
                      border: 1,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'soft.primary',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </Box>
                    <Typography variant="h3" sx={{ color: 'secondary.main', fontWeight: 800, mb: 1, fontSize: '1.25rem' }}>
                      No encontramos vuelos con esos filtros
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 450, mx: 'auto', mb: 3 }}>
                      Prueba ampliando el rango de precios, seleccionando más aerolíneas o eliminando los filtros aplicados.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleResetFilters}
                      sx={{ px: 3, py: 1, borderRadius: 2, fontWeight: 700 }}
                    >
                      Restablecer todos los filtros
                    </Button>
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
                        (selectedFlights.length >= maxComparisonFlights &&
                          !selectedFlights.some((item) => item.id === flight.id)) ||
                        (selectedFlights.length === 1 &&
                          (selectedFlights[0].originIata.toLowerCase() !== flight.originIata.toLowerCase() ||
                            selectedFlights[0].destinationIata.toLowerCase() !== flight.destinationIata.toLowerCase()))
                      }
                      isSavedToTrips={savedTripIds.has(flight.id)}
                      onComparisonToggle={handleComparisonToggle}
                      onViewDetailsClick={handleFlightDetailsClick}
                      onSaveTripClick={handleSaveFlightToTrips}
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
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            p: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '1.25rem' }}>
            Filtrar Vuelos
          </Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)} size="small">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </IconButton>
        </Box>
        <Box sx={{ overflowY: 'auto', pr: 0.5, mb: 2 }}>
          <FilterSidebar
            initialFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setMobileFilterOpen(false)}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '0.95rem' }}
        >
          Aplicar y Ver {flights.length} Vuelos
        </Button>
      </Drawer>

      <ComparisonSelectionBar
        selectedFlights={selectedFlights}
        onRemoveFlight={handleRemoveComparisonFlight}
        onClear={handleClearComparisonSelection}
        onCompare={handleCompareSelectedFlights}
      />

      {/* Notificaciones y validaciones de usuario */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 600, boxShadow: 4 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchResultsPage;
