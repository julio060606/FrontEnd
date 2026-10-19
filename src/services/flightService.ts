import axios from 'axios';
import { FlightItem, FlightFilterState, SearchQueryParams, SortOption } from '../types/flight.types';
import { MOCK_FLIGHT_RESULTS, MOCK_CURRENT_SEARCH } from '../mocks/flightsMocks';
import { z } from 'zod';
import { localStorageService } from './localStorageService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
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

const mapDtoToFlightItem = (dto: any): FlightItem => {
  const depDate = dto.departureTime ? new Date(dto.departureTime) : new Date();
  const arrDate = dto.arrivalTime ? new Date(dto.arrivalTime) : new Date();
  const duration = dto.durationMinutes || 80;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const hourOfDay = isNaN(depDate.getHours()) ? 12 : depDate.getHours();
  const timeOfDay: any = hourOfDay < 12 ? 'MORNING' : hourOfDay < 18 ? 'AFTERNOON' : 'NIGHT';

  return {
    id: String(dto.flightId || dto.id || dto.flightNumber),
    flightNumber: dto.flightNumber || 'FL-000',
    airline: {
      id: dto.airline?.id || 1,
      name: dto.airline?.name || 'LATAM Airlines',
      code: dto.airline?.iataCode || 'LA',
      iataCode: dto.airline?.iataCode || 'LA',
      colorBadge: 'primary',
    },
    cabinClass: 'Económica',
    originIata: dto.origin?.iataCode || 'LIM',
    originCity: dto.origin?.city || 'Lima',
    destinationIata: dto.destination?.iataCode || 'CUZ',
    destinationCity: dto.destination?.city || 'Cusco',
    departureDate: !isNaN(depDate.getTime()) ? depDate.toISOString().split('T')[0] : '2025-09-15',
    departureTime: !isNaN(depDate.getTime()) ? depDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '08:00',
    arrivalTime: !isNaN(arrDate.getTime()) ? arrDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '09:20',
    durationMinutes: duration,
    durationFormatted: `${hours}h ${minutes}m`,
    stopsCount: dto.stopsCount || 0,
    stopsFormatted: (dto.stopsCount || 0) === 0 ? 'Directo' : `${dto.stopsCount} escala`,
    price: typeof dto.basePrice === 'number' ? dto.basePrice : Number(dto.basePrice || dto.price || 65),
    currency: dto.currency || 'USD',
    tripTypeLabel: 'Solo ida',
    timeOfDay,
    amenities: {
      carryOnKg: 10,
      checkedBaggageIncluded: true,
      checkedBaggageKg: 23,
      wifiAvailable: true,
      snacksIncluded: true,
      changeAllowed: true,
      punctualityPercentage: 94,
    },
  };
};

export const flightService = {
  /**
   * Obtiene el resumen de la búsqueda actual
   */
  async getCurrentSearchParams(): Promise<SearchQueryParams> {
    hydratePersistedSearch();
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
    try {
      const promises = flightIds.map((id) =>
        axios.get(`${API_BASE_URL}/flights/${id}`, { timeout: 45000 })
      );
      const responses = await Promise.allSettled(promises);
      const backendFlights = responses
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => mapDtoToFlightItem(r.value.data));

      if (backendFlights.length === flightIds.length && backendFlights.length > 0) {
        return backendFlights;
      }
    } catch (e) {
      console.warn('Fallback a catálogo local para getFlightsByIds:', e);
    }

    const flights = flightIds
      .map((flightId) => MOCK_FLIGHT_RESULTS.find((flight) => flight.id === flightId))
      .filter((flight): flight is FlightItem => flight !== undefined);

    return flights;
  },

  /**
   * Busca y filtra vuelos según los criterios del usuario
   */
  async searchFlights(
    params?: Partial<SearchQueryParams>,
    filters?: Partial<FlightFilterState>,
    sortBy: SortOption = 'PRICE_ASC'
  ): Promise<FlightItem[]> {
    // 1. Siempre intenta llamar al endpoint real de Spring Boot: /api/v1/flights/search
    try {
      let departureDateParam: string | undefined = undefined;
      if (params?.departureDate) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(params.departureDate)) {
          departureDateParam = params.departureDate;
        } else {
          const parsed = new Date(params.departureDate);
          if (!isNaN(parsed.getTime())) {
            departureDateParam = parsed.toISOString().split('T')[0];
          }
        }
      }

      const response = await axios.get<any[]>(`${API_BASE_URL}/flights/search`, {
        params: {
          origin: params?.originIata,
          destination: params?.destinationIata,
          departureDate: departureDateParam,
          maxPrice: filters?.priceRange ? filters.priceRange[1] : undefined,
        },
        timeout: 45000,
      });

      if (Array.isArray(response.data)) {
        let results = response.data.map(mapDtoToFlightItem);

        // Aplicar ordenamiento
        if (sortBy === 'PRICE_ASC') {
          results.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'DURATION_ASC') {
          results.sort((a, b) => a.durationMinutes - b.durationMinutes);
        }
        return results;
      }
    } catch (error) {
      console.warn('Backend Spring Boot /flights/search no respondió o offline:', error);
      if (!USE_MOCKS) {
        return [];
      }
    }

    // 2. Respaldo local SOLO si la petición HTTP falló por desconexión del backend
    let results = [...MOCK_FLIGHT_RESULTS];
    if (params?.originIata) {
      results = results.filter((f) => f.originIata.toLowerCase() === params.originIata!.toLowerCase());
    }
    if (params?.destinationIata) {
      results = results.filter((f) => f.destinationIata.toLowerCase() === params.destinationIata!.toLowerCase());
    }

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

    if (sortBy === 'PRICE_ASC') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'DURATION_ASC') {
      results.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'BEST') {
      results.sort((a, b) => {
        const scoreA = a.price * 0.6 + a.durationMinutes * 0.3 + a.stopsCount * 50;
        const scoreB = b.price * 0.6 + b.durationMinutes * 0.3 + b.stopsCount * 50;
        return scoreA - scoreB;
      });
    }

    return simulateDelay(results, 150);
  },
};
