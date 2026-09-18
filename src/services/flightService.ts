import { FlightItem, FlightFilterState, SearchQueryParams, SortOption } from '../types/flight.types';
import { MOCK_FLIGHT_RESULTS, MOCK_CURRENT_SEARCH } from '../mocks/flightsMocks';
import { z } from 'zod';
import { localStorageService } from './localStorageService';

/**
 * Feature Toggle para alternar entre Mock Data y API REST de Spring Boot
 * Controlado mediante la variable de entorno VITE_USE_MOCKS (por defecto true en Sprint 1)
 */
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
export const LAST_FLIGHT_SEARCH_STORAGE_KEY = 'chasquifly:last-flight-search:v1';

const persistedSearchSchema = z.object({
  version: z.literal(1),
  params: z.object({
    origin: z.string().min(1),
    originIata: z.string().min(3),
    destination: z.string().min(1),
    destinationIata: z.string().min(3),
    departureDate: z.string().min(1),
    returnDate: z.string().min(1).optional(),
    passengers: z.number().int().min(1).max(9),
    travelClass: z.string().min(1),
    tripType: z.enum(['ONE_WAY', 'ROUND_TRIP']).optional(),
  }),
});

type PersistedSearch = z.infer<typeof persistedSearchSchema>;

const simulateDelay = <T>(data: T, ms: number = 300): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

let activeSearchParams: SearchQueryParams = { ...MOCK_CURRENT_SEARCH };
let hasHydratedPersistedSearch = false;
let isSearchPersisted = false;

const hydratePersistedSearch = (): void => {
  if (hasHydratedPersistedSearch) {
    return;
  }

  const storedSearch = localStorageService.read<PersistedSearch>(
    LAST_FLIGHT_SEARCH_STORAGE_KEY,
    persistedSearchSchema,
  );

  if (storedSearch) {
    activeSearchParams = { ...storedSearch.params };
    isSearchPersisted = true;
  }

  hasHydratedPersistedSearch = true;
};

export const flightService = {
  /**
   * Obtiene el resumen de la búsqueda actual
   */
  async getCurrentSearchParams(): Promise<SearchQueryParams> {
    hydratePersistedSearch();
    if (USE_MOCKS) {
      return simulateDelay(activeSearchParams, 100);
    }
    return activeSearchParams;
  },

  /**
   * Actualiza los parámetros de búsqueda activos en memoria/mock
   */
  setCurrentSearchParams(params: SearchQueryParams): void {
    activeSearchParams = { ...params };
    hasHydratedPersistedSearch = true;
    isSearchPersisted = localStorageService.save<PersistedSearch>(
      LAST_FLIGHT_SEARCH_STORAGE_KEY,
      { version: 1, params: activeSearchParams },
    );
  },

  clearPersistedSearch(): void {
    localStorageService.remove(LAST_FLIGHT_SEARCH_STORAGE_KEY);
    activeSearchParams = { ...MOCK_CURRENT_SEARCH };
    hasHydratedPersistedSearch = true;
    isSearchPersisted = false;
  },

  hasPersistedSearch(): boolean {
    hydratePersistedSearch();
    return isSearchPersisted;
  },

  /**
   * Recupera vuelos concretos conservando el orden de los identificadores.
   * Permite restaurar una selección de comparación desde la URL.
   */
  async getFlightsByIds(flightIds: string[]): Promise<FlightItem[]> {
    const flights = flightIds
      .map((flightId) => MOCK_FLIGHT_RESULTS.find((flight) => flight.id === flightId))
      .filter((flight): flight is FlightItem => flight !== undefined);

    return USE_MOCKS ? simulateDelay(flights, 100) : flights;
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
