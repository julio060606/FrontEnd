import React from 'react';
import {
  Box,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ComparisonPriority } from '../../../types/compare.types';

interface PriorityOption {
  value: ComparisonPriority;
  label: string;
  description: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    value: 'BALANCED',
    label: 'Equilibrado',
    description: 'Balance general',
  },
  {
    value: 'LOWEST_PRICE',
    label: 'Ahorrar',
    description: 'Prioriza el precio',
  },
  {
    value: 'SHORTEST_TIME',
    label: 'Llegar antes',
    description: 'Duración y escalas',
  },
  {
    value: 'MOST_COMPLETE',
    label: 'Más servicios',
    description: 'Equipaje y flexibilidad',
  },
];

export interface ComparisonPrioritySelectorProps {
  value: ComparisonPriority;
  onChange: (priority: ComparisonPriority) => void;
}

export const ComparisonPrioritySelector: React.FC<ComparisonPrioritySelectorProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    selectedPriority: ComparisonPriority | null,
  ) => {
    if (selectedPriority) {
      onChange(selectedPriority);
    }
  };

  return (
    <Paper
      component="section"
      elevation={0}
      aria-labelledby="comparison-priority-title"
      sx={{
        p: { xs: 2, md: 2.5 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography
            id="comparison-priority-title"
            variant="subtitle1"
            sx={{ color: 'secondary.main', fontWeight: 800 }}
          >
            ¿Qué es más importante para ti?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ajusta el criterio y revisa cómo cambia la recomendación.
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={handleChange}
          aria-label="Prioridad para comparar vuelos"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' },
            '& .MuiToggleButtonGroup-grouped': {
              borderRadius: '10px !important',
              border: '1px solid !important',
              borderColor: 'divider !important',
              mx: { sm: 0.5 },
            },
          }}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <ToggleButton
              key={option.value}
              value={option.value}
              aria-label={`${option.label}: ${option.description}`}
              sx={{
                px: { xs: 1, sm: 1.5 },
                py: 1,
                textTransform: 'none',
                minWidth: { sm: 128 },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <Stack spacing={0.15} alignItems="center">
                <Typography component="span" variant="body2" fontWeight={700}>
                  {option.label}
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: 'inherit', opacity: 0.8, lineHeight: 1.2 }}
                >
                  {option.description}
                </Typography>
              </Stack>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
};

export default ComparisonPrioritySelector;
