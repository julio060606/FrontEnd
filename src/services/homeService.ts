import axios from 'axios';
import { PopularDestination, AiComparisonScenario, AirportOption } from '../types/home.types';
import { MOCK_POPULAR_DESTINATIONS, MOCK_AI_COMPARISON_SCENARIO, MOCK_AIRPORTS } from '../mocks/homeMocks';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

// Helper para simular latencia de red en entorno de pruebas
const simulateNetworkDelay = <T>(data: T, delayMs: number = 300): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
};

export const homeService = {
  /**
   * Obtiene la lista de destinos populares para la sección de inicio
   */
  async getPopularDestinations(): Promise<PopularDestination[]> {
    try {
      await axios.get(`${API_BASE_URL}/flights/popular-destinations`, { timeout: 45000 });
    } catch (e) {
      // Fallback
    }
    return MOCK_POPULAR_DESTINATIONS;
  },

  /**
   * Obtiene el escenario de recomendación y comparación asistida por IA
   */
  async getAiComparisonScenario(): Promise<AiComparisonScenario> {
    try {
      await axios.get(`${API_BASE_URL}/flights/ai-recommendation`, { timeout: 45000 });
    } catch (e) {
      // Fallback
    }
    return MOCK_AI_COMPARISON_SCENARIO;
  },

  /**
   * Obtiene el catálogo de aeropuertos para el autocompletado del buscador
   */
  async getAirports(): Promise<AirportOption[]> {
    try {
      const response = await axios.get<AirportOption[]>(`${API_BASE_URL}/airports`, { timeout: 45000 });
      return response.data;
    } catch (error) {
      console.warn('Error al obtener aeropuertos de Spring Boot, usando fallback:', error);
      return simulateNetworkDelay(MOCK_AIRPORTS, 150);
    }
  },
};
