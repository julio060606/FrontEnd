import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import SearchSummaryBar from '../components/SearchSummaryBar';
import FilterSidebar from '../components/FilterSidebar';
import FlightCard from '../components/FlightCard';
import { flightService } from '../../../services/flightService';
import {
  FlightItem,
  FlightFilterState,
  SearchQueryParams,
  SortOption,
} from '../../../types/flight.types';

export const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchQueryParams | undefined>(undefined);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortOption>('PRICE_ASC');
  const [filters, setFilters] = useState<FlightFilterState>({
    stops: [],
    priceRange: [80, 500],
    airlines: [],
    departureTimes: [],
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Barra de Resumen de Búsqueda */}
      <SearchSummaryBar
        searchParams={searchParams}
        onEditSearchClick={() => navigate('/')}
      />

      {/* Contenedor Principal: Filtros + Resultados */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 4 }, px: { xs: 2, sm: 4, lg: 6 } }}>
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
    </Box>
  );
};

export default SearchResultsPage;
