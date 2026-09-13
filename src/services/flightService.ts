import { FlightItem, FlightFilterState, SearchQueryParams, SortOption } from '../types/flight.types';
import { MOCK_FLIGHT_RESULTS, MOCK_CURRENT_SEARCH } from '../mocks/flightsMocks';

/**
 * Feature Toggle para alternar entre Mock Data y API REST de Spring Boot
 * Controlado mediante la variable de entorno VITE_USE_MOCKS (por defecto true en Sprint 1)
 */
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const simulateDelay = <T>(data: T, ms: number = 300): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

export const flightService = {
  /**
   * Obtiene el resumen de la búsqueda actual
   */
  async getCurrentSearchParams(): Promise<SearchQueryParams> {
    if (USE_MOCKS) {
      return simulateDelay(MOCK_CURRENT_SEARCH, 100);
    }
    return MOCK_CURRENT_SEARCH;
  },

  /**
   * Busca y filtra vuelos según los criterios del usuario
   */
  async searchFlights(
    params?: Partial<SearchQueryParams>,
    filters?: Partial<FlightFilterState>,
    sortBy: SortOption = 'PRICE_ASC'
  ): Promise<FlightItem[]> {
    if (USE_MOCKS) {
      let results = [...MOCK_FLIGHT_RESULTS];

      // Aplicar filtros en memoria si existen
      if (filters) {
        if (filters.stops && filters.stops.length > 0) {
          results = results.filter((f) => filters.stops!.includes(f.stopsCount));
        }

        if (filters.priceRange) {
          const [min, max] = filters.priceRange;
          results = results.filter((f) => f.price >= min && f.price <= max);
        }

        if (filters.airlines && filters.airlines.length > 0) {
          results = results.filter((f) =>
            filters.airlines!.some((selectedAirline) =>
              f.airline.name.toLowerCase().includes(selectedAirline.toLowerCase()) ||
              selectedAirline.toLowerCase().includes(f.airline.name.toLowerCase())
            )
          );
        }

        if (filters.departureTimes && filters.departureTimes.length > 0) {
          results = results.filter((f) => filters.departureTimes!.includes(f.timeOfDay));
        }
      }

      // Ordenar resultados
      if (sortBy === 'PRICE_ASC') {
        results.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'DURATION_ASC') {
        results.sort((a, b) => a.durationMinutes - b.durationMinutes);
      } else if (sortBy === 'BEST') {
        // Mejor balance: menor precio, menor duración y menos escalas
        results.sort((a, b) => {
          const scoreA = a.price * 0.6 + a.durationMinutes * 0.3 + a.stopsCount * 50;
          const scoreB = b.price * 0.6 + b.durationMinutes * 0.3 + b.stopsCount * 50;
          return scoreA - scoreB;
        });
      }

      return simulateDelay(results, 250);
    }

    // =========================================================================
    // Preparado para el Sprint 2: Consumo directo de la API Spring Boot
    // =========================================================================
    /*
    const response = await axios.get<FlightItem[]>('/api/v1/flights/search', {
      params: {
        origin: params?.originIata,
        destination: params?.destinationIata,
        departureDate: params?.departureDate,
        returnDate: params?.returnDate,
        passengers: params?.passengers,
        travelClass: params?.travelClass,
        maxPrice: filters?.priceRange ? filters.priceRange[1] : undefined,
        stops: filters?.stops?.join(','),
        airlines: filters?.airlines?.join(','),
        sortBy,
      },
    });
    return response.data;
    */
    return MOCK_FLIGHT_RESULTS;
  },
};
