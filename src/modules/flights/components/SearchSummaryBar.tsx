import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FlightIcon from '@mui/icons-material/Flight';
import { FlightSearchFormData, SearchQueryParams } from '../../../types/flight.types';

export interface SearchSummaryBarProps {
  searchParams?: SearchQueryParams;
  searchData?: FlightSearchFormData;
  onEditSearchClick?: () => void;
  onEditClick?: () => void;
  isSearchPersisted?: boolean;
  onForgetSavedSearch?: () => void;
}

export const SearchSummaryBar: React.FC<SearchSummaryBarProps> = ({
  searchParams,
  searchData,
  onEditSearchClick,
  onEditClick,
  isSearchPersisted = false,
  onForgetSavedSearch,
}) => {
  const originIata =
    searchData?.origin?.iataCode ||
    searchParams?.originIata ||
    (searchParams?.origin ? searchParams.origin.slice(0, 3).toUpperCase() : 'LIM');

  const destinationIata =
    searchData?.destination?.iataCode ||
    searchParams?.destinationIata ||
    (searchParams?.destination ? searchParams.destination.slice(0, 3).toUpperCase() : 'CUZ');

  const formatDateLabel = (d?: Date | string | null): string => {
    if (!d) return '';
    if (typeof d === 'string') return d;
    try {
      return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
    } catch {
      return String(d);
    }
  };

  const depDateText = searchData?.departureDate
    ? formatDateLabel(searchData.departureDate)
    : searchParams?.departureDate || '15 Sep';

  const retDateText = searchData?.returnDate
    ? formatDateLabel(searchData.returnDate)
    : searchParams?.returnDate || '20 Sep';

  const isRoundTrip = searchData
    ? searchData.tripType === 'ROUND_TRIP'
    : Boolean(searchParams?.returnDate);

  const tripDates = isRoundTrip && retDateText ? `${depDateText} - ${retDateText}` : depDateText;

  const passengers = searchData?.passengers || searchParams?.passengers || 1;
  const passengerText = `${passengers} ${passengers === 1 ? 'Pasajero' : 'Pasajeros'}`;

  const travelClass = (
    searchData?.travelClass ||
    searchParams?.travelClass ||
    'Económica'
  ).replace('_', ' ');

  const handleEdit = () => {
    if (onEditSearchClick) {
      onEditSearchClick();
    } else if (onEditClick) {
      onEditClick();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        p: 2,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        mx: { xs: 2, sm: 4, lg: 6 },
        mt: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
        {/* Ruta */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 800 }}>
            {originIata}
          </Typography>
          <FlightIcon sx={{ color: 'primary.main', transform: 'rotate(90deg)', fontSize: 22 }} />
          <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 800 }}>
            {destinationIata}
          </Typography>
        </Box>

        <Box sx={{ width: '1px', height: 24, bgcolor: 'divider', display: { xs: 'none', sm: 'block' } }} />

        {/* Fechas */}
        <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600 }}>
          {tripDates}
        </Typography>

        <Box sx={{ width: '1px', height: 24, bgcolor: 'divider', display: { xs: 'none', sm: 'block' } }} />

        {/* Info extra */}
        <Box display="flex" gap={1}>
          <Chip
            label={passengerText}
            size="small"
            sx={{ bgcolor: 'action.hover', color: 'text.secondary', borderRadius: '6px', fontWeight: 600 }}
          />
          <Chip
            label={travelClass}
            size="small"
            sx={{ bgcolor: 'soft.primary', color: 'primary.main', borderRadius: '6px', fontWeight: 600 }}
          />
        </Box>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap">
        {isSearchPersisted && onForgetSavedSearch && (
          <Button
            variant="text"
            color="secondary"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={onForgetSavedSearch}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Olvidar búsqueda guardada
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{
            color: 'primary.main',
            borderColor: 'divider',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            '&:hover': {
              bgcolor: 'soft.primary',
              borderColor: 'primary.main',
            },
          }}
        >
          Modificar
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchSummaryBar;
