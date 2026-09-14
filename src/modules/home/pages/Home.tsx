import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import HeroSection from '../components/HeroSection';
import PopularDestinations from '../components/PopularDestinations';
import AiFlightComparison from '../components/AiFlightComparison';
import PromoBanner from '../components/PromoBanner';
import { homeService } from '../../../services/homeService';
import { flightService } from '../../../services/flightService';
import { PopularDestination, AiComparisonScenario } from '../../../types/home.types';
import { searchFlightsMock } from '../../flights/services/flight.service.mock';
import { FlightSearchFormData } from '../../../types/flight.types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<PopularDestination[]>([]);
  const [aiScenario, setAiScenario] = useState<AiComparisonScenario | undefined>(undefined);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        setIsLoadingDestinations(true);
        const [destinationsData, aiData] = await Promise.all([
          homeService.getPopularDestinations(),
          homeService.getAiComparisonScenario(),
        ]);

        if (isMounted) {
          setDestinations(destinationsData);
          setAiScenario(aiData);
        }
      } catch (error) {
        console.error('Error al cargar datos de la pantalla de inicio:', error);
      } finally {
        if (isMounted) {
          setIsLoadingDestinations(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async (formData: FlightSearchFormData) => {
    if (!formData.origin || !formData.destination) return;

    try {
      const depDateFormatted = formData.departureDate
        ? formData.departureDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
        : '15 Sep';

      const retDateFormatted = formData.returnDate
        ? formData.returnDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })
        : undefined;

      // Actualizar los parámetros en el servicio de vuelos
      flightService.setCurrentSearchParams({
        origin: formData.origin.city,
        originIata: formData.origin.iataCode,
        destination: formData.destination.city,
        destinationIata: formData.destination.iataCode,
        departureDate: depDateFormatted,
        returnDate: formData.tripType === 'ROUND_TRIP' ? retDateFormatted : undefined,
        passengers: formData.passengers,
        travelClass: formData.travelClass === 'ECONOMY' ? 'Económica' : formData.travelClass,
        tripType: formData.tripType,
      });

      // Ejecución del mock de búsqueda de US04
      const vuelosSimulados = await searchFlightsMock(formData);
      console.log('✈️ Vuelos encontrados de forma simulada (Mock US04):', vuelosSimulados);

      // Redirección a la pantalla de resultados
      navigate('/flights');
    } catch (error) {
      console.error('Error al procesar búsqueda de vuelos:', error);
    }
  };

  const handleDestinationClick = (destination: PopularDestination) => {
    console.log('Destino popular seleccionado:', destination.city);
    flightService.setCurrentSearchParams({
      origin: 'Lima',
      originIata: 'LIM',
      destination: destination.city,
      destinationIata: destination.id.replace('dest-', '').toUpperCase(),
      departureDate: '15 Sep',
      returnDate: '20 Sep',
      passengers: 1,
      travelClass: 'Económica',
      tripType: 'ROUND_TRIP',
    });
    navigate('/flights');
  };

  const handleCompareClick = (scenario: AiComparisonScenario) => {
    navigate(
      `/compare?flightA=${encodeURIComponent(scenario.flight1.id)}&flightB=${encodeURIComponent(scenario.flight2.id)}`,
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* 1. Hero con Buscador Integrado (US01 + US04) */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSection onSearch={handleSearch} />

        {/* 2. Destinos Populares en Perú */}
        <PopularDestinations
          destinations={destinations}
          isLoading={isLoadingDestinations}
          onDestinationClick={handleDestinationClick}
        />

        {/* 3. Escenario y Comparador Asistido por IA */}
        <AiFlightComparison
          scenario={aiScenario}
          onCompareClick={handleCompareClick}
        />

        {/* 4. Banner Promocional de Alertas y Monitoreo */}
        <PromoBanner
          onBannerActionClick={() => navigate('/tracker')}
        />
      </Box>
    </Box>
  );
};

export default Home;
