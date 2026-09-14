import React from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FlightItem } from '../../../types/flight.types';

export interface ComparisonSelectionBarProps {
  selectedFlights: FlightItem[];
  onRemoveFlight: (flightId: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export const ComparisonSelectionBar: React.FC<ComparisonSelectionBarProps> = ({
  selectedFlights,
  onRemoveFlight,
  onClear,
  onCompare,
}) => {
  if (selectedFlights.length === 0) {
    return null;
  }

  const isReadyToCompare = selectedFlights.length === 2;

  return (
    <Paper
      role="region"
      aria-label="Vuelos seleccionados para comparar"
      elevation={0}
      sx={{
        position: 'fixed',
        left: '50%',
        bottom: { xs: 12, sm: 20 },
        transform: 'translateX(-50%)',
        zIndex: (theme) => theme.zIndex.snackbar,
        width: 'calc(100% - 32px)',
        maxWidth: 1120,
        p: { xs: 1.5, sm: 2 },
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 3,
        boxShadow: '0 12px 40px rgba(27, 42, 74, 0.2)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 800 }}>
            Comparación {selectedFlights.length}/2
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {isReadyToCompare
              ? 'Tus dos vuelos están listos para comparar.'
              : 'Selecciona un vuelo más para continuar.'}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{ flex: 1, justifyContent: { md: 'center' } }}
        >
          {selectedFlights.map((flight) => (
            <Chip
              key={flight.id}
              label={`${flight.flightNumber} · ${flight.airline.name}`}
              onClick={() => onRemoveFlight(flight.id)}
              onDelete={() => onRemoveFlight(flight.id)}
              deleteIcon={<DeleteOutlineIcon />}
              aria-label={`Quitar vuelo ${flight.flightNumber}`}
              sx={{ maxWidth: { xs: '100%', sm: 240 } }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="text" color="secondary" onClick={onClear}>
            Limpiar
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isReadyToCompare}
            startIcon={<CompareArrowsIcon />}
            onClick={onCompare}
          >
            Comparar ahora
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ComparisonSelectionBar;
