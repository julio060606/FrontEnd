import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch';
import PopularDestinations from '../components/PopularDestinations';
import AiFlightComparison from '../components/AiFlightComparison';
import PromoBanner from '../components/PromoBanner';
import { homeService } from '../../../services/homeService';
import { PopularDestination, AiComparisonScenario, HeroSearchValues } from '../../../types/home.types';

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

  const handleSearch = (searchValues: HeroSearchValues) => {
    console.log('Ejecutando búsqueda con parámetros:', searchValues);
    // Redirección o actualización de estado para el buscador del Sprint 1
  };

  const handleDestinationClick = (destination: PopularDestination) => {
    console.log('Destino seleccionado:', destination.city);
  };

  const handleCompareClick = (scenario: AiComparisonScenario) => {
    navigate(
      `/compare?flightA=${encodeURIComponent(scenario.flight1.id)}&flightB=${encodeURIComponent(scenario.flight2.id)}`,
    );
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
