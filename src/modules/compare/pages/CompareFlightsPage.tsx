import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  Skeleton,
  Paper,
  Alert,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CompareHeaderCards from '../components/CompareHeaderCards';
import CompareSpecsTable from '../components/CompareSpecsTable';
import AIRecommendationBanner from '../components/AIRecommendationBanner';
import ComparisonPrioritySelector from '../components/ComparisonPrioritySelector';
import { compareService } from '../../../services/compareService';
import {
  FlightComparisonData,
  CompareFlightCardData,
  ComparisonPriority,
} from '../../../types/compare.types';

const parseComparisonPriority = (value: string | null): ComparisonPriority => {
  switch (value) {
    case 'LOWEST_PRICE':
    case 'SHORTEST_TIME':
    case 'MOST_COMPLETE':
      return value;
    default:
      return 'BALANCED';
  }
};

export interface CompareFlightsPageProps {
  flightIdA?: string;
  flightIdB?: string;
  onNavigateBack?: () => void;
  onFlightSelected?: (flight: CompareFlightCardData) => void;
}

export const CompareFlightsPage: React.FC<CompareFlightsPageProps> = ({
  flightIdA,
  flightIdB,
  onNavigateBack,
  onFlightSelected,
}) => {
  const navigate = useNavigate();
  const [comparisonSearchParams, setComparisonSearchParams] = useSearchParams();
  const selectedFlightIdA = flightIdA ?? comparisonSearchParams.get('flightA') ?? undefined;
  const selectedFlightIdB = flightIdB ?? comparisonSearchParams.get('flightB') ?? undefined;
  const selectedFlightCandidate = comparisonSearchParams.get('selected') ?? undefined;
  const selectedFlightId = selectedFlightCandidate === selectedFlightIdA
    || selectedFlightCandidate === selectedFlightIdB
    ? selectedFlightCandidate
    : undefined;
  const hasValidSelection = Boolean(
    selectedFlightIdA
      && selectedFlightIdB
      && selectedFlightIdA !== selectedFlightIdB,
  );
  const [data, setData] = useState<FlightComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [priority, setPriority] = useState<ComparisonPriority>(() =>
    parseComparisonPriority(comparisonSearchParams.get('priority')),
  );

  const resultsSearchParams = new URLSearchParams();
  if (selectedFlightIdA) {
    resultsSearchParams.set('flightA', selectedFlightIdA);
  }
  if (selectedFlightIdB && selectedFlightIdB !== selectedFlightIdA) {
    resultsSearchParams.set('flightB', selectedFlightIdB);
  }
  const resultsUrl = `/flights${resultsSearchParams.size > 0 ? `?${resultsSearchParams.toString()}` : ''}`;

  useEffect(() => {
    let isMounted = true;

    if (!hasValidSelection || !selectedFlightIdA || !selectedFlightIdB) {
      setData(null);
      setErrorMessage(null);
      setIsLoading(false);

      return () => {
        isMounted = false;
      };
    }

    const loadComparison = async () => {
      try {
        setIsLoading(true);
        setData(null);
        setErrorMessage(null);
        const result = await compareService.getFlightComparison(
          selectedFlightIdA,
          selectedFlightIdB,
          priority,
        );
        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error('Error al cargar comparación de vuelos:', error);
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'No pudimos preparar la comparación solicitada.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadComparison();

    return () => {
      isMounted = false;
    };
  }, [hasValidSelection, priority, selectedFlightIdA, selectedFlightIdB]);

  const handlePriorityChange = (selectedPriority: ComparisonPriority) => {
    setPriority(selectedPriority);
    const nextSearchParams = new URLSearchParams(comparisonSearchParams);

    if (selectedPriority === 'BALANCED') {
      nextSearchParams.delete('priority');
    } else {
      nextSearchParams.set('priority', selectedPriority);
    }

    setComparisonSearchParams(nextSearchParams, { replace: true });
  };

  const handleNavigateBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
      return;
    }

    navigate(resultsUrl);
  };

  const handleSelectFlight = (flight: CompareFlightCardData) => {
    const nextSearchParams = new URLSearchParams(comparisonSearchParams);
    nextSearchParams.set('selected', flight.id);
    setComparisonSearchParams(nextSearchParams, { replace: true });
    onFlightSelected?.(flight);
  };

  const handleClearSelection = () => {
    const nextSearchParams = new URLSearchParams(comparisonSearchParams);
    nextSearchParams.delete('selected');
    setComparisonSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Contenido Principal */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 }, px: { xs: 2, sm: 4, lg: 8 } }}>
        <Container maxWidth="xl" disableGutters>
          <Stack spacing={4}>
            {/* Breadcrumbs */}
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              sx={{
                '& .MuiBreadcrumbs-separator': { color: 'text.secondary', fontSize: '1rem' },
              }}
            >
              <Link
                component={RouterLink}
                to="/"
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.8125rem', fontWeight: 500 }}
              >
                Inicio
              </Link>
              <Link
                component={RouterLink}
                to={resultsUrl}
                underline="hover"
                color="text.secondary"
                onClick={(e) => {
                  if (onNavigateBack) {
                    e.preventDefault();
                    handleNavigateBack();
                  }
                }}
                sx={{ fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Resultados
              </Link>
              <Typography color="primary.main" sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                Comparar vuelos
              </Typography>
            </Breadcrumbs>

            {/* Encabezado de Página */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 800,
                    fontSize: { xs: '1.75rem', md: '2rem' },
                  }}
                >
                  Compara tus vuelos
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem', mt: 0.5 }}>
                  No te quedes con la duda. Compara lado a lado y elige el vuelo perfecto para ti.
                </Typography>
              </Box>

              {hasValidSelection && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleNavigateBack}
                  sx={{ flexShrink: 0 }}
                >
                  Cambiar vuelos
                </Button>
              )}
            </Stack>

            {!hasValidSelection ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 7 },
                  textAlign: 'center',
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <CompareArrowsIcon sx={{ color: 'primary.main', fontSize: 52, mb: 2 }} />
                <Typography variant="h3" sx={{ color: 'secondary.main', mb: 1 }}>
                  Selecciona dos vuelos para comparar
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: 520, mx: 'auto', mb: 3 }}>
                  Necesitamos dos vuelos diferentes. Vuelve a los resultados y usa el botón
                  Comparar de las opciones que quieras analizar lado a lado.
                </Typography>
                <Button
                  component={RouterLink}
                  to={resultsUrl}
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                >
                  Seleccionar vuelos
                </Button>
              </Paper>
            ) : errorMessage ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 6 },
                  textAlign: 'center',
                  borderRadius: 4,
                  border: 1,
                  borderColor: 'error.main',
                }}
              >
                <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 52, mb: 2 }} />
                <Typography variant="h3" sx={{ color: 'secondary.main', mb: 2 }}>
                  No podemos comparar estos vuelos
                </Typography>
                <Alert severity="error" sx={{ maxWidth: 620, mx: 'auto', mb: 3, textAlign: 'left' }}>
                  {errorMessage}
                </Alert>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleNavigateBack}
                >
                  Elegir otros vuelos
                </Button>
              </Paper>
            ) : isLoading || !data ? (
              <Stack spacing={4}>
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: 4 }} />
                <Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} />
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
              </Stack>
            ) : (
              <Stack spacing={4}>
                <ComparisonPrioritySelector
                  value={priority}
                  onChange={handlePriorityChange}
                />

                {selectedFlightId && (() => {
                  const selectedFlight = selectedFlightId === data.flightA.id
                    ? data.flightA
                    : data.flightB;

                  return (
                    <Alert
                      severity="success"
                      sx={{
                        alignItems: 'flex-start',
                        borderRadius: 2,
                        '& .MuiAlert-message': { width: '100%' },
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent="space-between"
                        spacing={1.5}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            Elegiste {selectedFlight.airline.name} {selectedFlight.flightNumber}
                          </Typography>
                          <Typography variant="caption">
                            Guardamos tu decisión en esta comparación. Esto no realiza una compra ni una reserva.
                          </Typography>
                        </Box>
                        <Button
                          color="inherit"
                          size="small"
                          onClick={handleClearSelection}
                          sx={{ flexShrink: 0 }}
                        >
                          Quitar elección
                        </Button>
                      </Stack>
                    </Alert>
                  );
                })()}

                {/* Bloque Superior: Tarjetas de Vuelo con VS */}
                <CompareHeaderCards
                  flightA={data.flightA}
                  flightB={data.flightB}
                  recommendedFlightId={data.recommendation?.recommendedFlightId}
                  selectedFlightId={selectedFlightId}
                  onSelectFlight={handleSelectFlight}
                />

                {/* Bloque Intermedio: Tabla de Factores y Especificaciones */}
                <CompareSpecsTable
                  airlineAName={data.flightA.airline.name}
                  airlineBName={data.flightB.airline.name}
                  specs={data.specs}
                />

                {data.recommendation && (
                  <AIRecommendationBanner
                    recommendation={data.recommendation}
                    isRecommendedFlightSelected={
                      selectedFlightId === data.recommendation.recommendedFlightId
                    }
                    onSelectRecommended={() => {
                      const recommendedFlight = data.recommendation?.recommendedFlightId === data.flightA.id
                        ? data.flightA
                        : data.flightB;
                      handleSelectFlight(recommendedFlight);
                    }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

    </Box>
  );
};

export default CompareFlightsPage;
