import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import HeroSearch from '../components/HeroSection';
import PopularDestinations from '../components/PopularDestinations';
import AiFlightComparison from '../components/AiFlightComparison';
import PromoBanner from '../components/PromoBanner';
import { homeService } from '../../../services/homeService';
import { PopularDestination, AiComparisonScenario, HeroSearchValues } from '../../../types/home.types';

import { searchFlightsMock } from '../../flights/services/flight.service.mock';
import { Flight, FlightSearchFormData } from '../../../types/flight.types';

export const Home: React.FC = () => {
  const [destinations, setDestinations] = useState<PopularDestination[]>([]);
  const [aiScenario, setAiScenario] = useState<AiComparisonScenario | undefined>(undefined);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

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

  const handleSearch = async (searchValues: HeroSearchValues) => {
    console.log('Ejecutando búsqueda con parámetros:', searchValues);
    try {
      setIsSearching(true);
      
      // Adaptar HeroSearchValues a FlightSearchFormData para que el mock lo entienda
      const mockData: FlightSearchFormData = {
        tripType: searchValues.tripType,
        origin: { 
          iataCode: searchValues.origin.slice(-4, -1), 
          city: searchValues.origin.split(' (')[0], 
          id: 1, name: '', country: 'Perú' 
        },
        destination: { 
          iataCode: searchValues.destination.slice(-4, -1), 
          city: searchValues.destination.split(' (')[0], 
          id: 2, name: '', country: 'Perú' 
        },
        departureDate: new Date(),
        returnDate: searchValues.returnDate ? new Date() : null,
        passengers: searchValues.passengers as number || 1,
        travelClass: searchValues.travelClass as any,
      };

      const vuelosEncontrados = await searchFlightsMock(mockData);
      setSearchResults(vuelosEncontrados);
      console.log("✈️ Vuelos encontrados de forma simulada (Mock):", vuelosEncontrados);
    } catch (error) {
      console.error("Error buscando vuelos simulados:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDestinationClick = (destination: PopularDestination) => {
    console.log('Destino seleccionado:', destination.city);
  };

  const handleCompareClick = (scenario: AiComparisonScenario) => {
    console.log('Comparando vuelos asistidos por IA:', scenario);
  };

  const handleLoginClick = () => {
    console.log('Abrir modal de login');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Hero con Buscador Integrado */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <HeroSearch onSearch={handleSearch} />

        {/* 3. Sección A: Destinos Populares */}
        <PopularDestinations
          destinations={destinations}
          isLoading={isLoadingDestinations}
          onDestinationClick={handleDestinationClick}
        />

        {/* 4. Sección B: Recomendación y Comparador Asistido por IA */}
        <AiFlightComparison
          scenario={aiScenario}
          onCompareClick={handleCompareClick}
        />

        {/* 5. Sección C: Banner Promocional de Alertas */}
        <PromoBanner
          onBannerActionClick={() => console.log('Activar alertas')}
        />
      </Box>

    </Box>
  );
};

export default Home;
