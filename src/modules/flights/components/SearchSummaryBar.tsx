import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FlightIcon from '@mui/icons-material/Flight';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { FlightSearchFormData } from '../../../types/flight.types';

interface SearchSummaryBarProps {
  searchData: FlightSearchFormData;
  onEditClick: () => void;
}

export const SearchSummaryBar: React.FC<SearchSummaryBarProps> = ({ searchData, onEditClick }) => {
  if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
    return null;
  }

  const dateFmt = (d: Date) => format(d, "d MMM", { locale: es });
  
  const tripDates = searchData.tripType === 'ROUND_TRIP' && searchData.returnDate
    ? `${dateFmt(searchData.departureDate)} - ${dateFmt(searchData.returnDate)}`
    : dateFmt(searchData.departureDate);

  const passengerText = `${searchData.passengers} ${searchData.passengers === 1 ? 'Pasajero' : 'Pasajeros'}`;

  return (
    <Paper 
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: '12px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2DBD7',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Box display="flex" alignItems="center" gap={3}>
        
        {/* Ruta */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" sx={{ color: '#1B2A4A', fontWeight: 700 }}>
            {searchData.origin.iataCode}
          </Typography>
          <FlightIcon sx={{ color: '#A01B2D', transform: 'rotate(90deg)', fontSize: 20 }} />
          <Typography variant="h5" sx={{ color: '#1B2A4A', fontWeight: 700 }}>
            {searchData.destination.iataCode}
          </Typography>
        </Box>

        <Box sx={{ width: '1px', height: 24, bgcolor: '#E2DBD7' }} />

        {/* Fechas */}
        <Typography variant="body2" sx={{ color: '#1B2A4A', fontWeight: 600 }}>
          {tripDates}
        </Typography>

        <Box sx={{ width: '1px', height: 24, bgcolor: '#E2DBD7' }} />

        {/* Info extra */}
        <Box display="flex" gap={1}>
          <Chip 
            label={passengerText} 
            size="small" 
            sx={{ bgcolor: '#F3F3F3', color: '#6B615E', borderRadius: '6px' }} 
          />
          <Chip 
            label={searchData.travelClass.replace('_', ' ')} 
            size="small" 
            sx={{ bgcolor: '#FDE8EC', color: '#A01B2D', borderRadius: '6px', fontWeight: 500 }} 
          />
        </Box>
      </Box>

      {/* Botón Modificar */}
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={onEditClick}
        sx={{
          color: '#A01B2D',
          borderColor: '#E2DBD7',
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          '&:hover': {
            bgcolor: '#FEF1EF',
            borderColor: '#A01B2D'
          }
        }}
      >
        Modificar
      </Button>
    </Paper>
  );
};
