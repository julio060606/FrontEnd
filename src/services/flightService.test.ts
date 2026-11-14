/**
 * Suite de pruebas unitarias para flightService y applyFiltersAndSort (9 pruebas).
 * Verifica la hidratación/persistencia de búsqueda y el pipeline reactivo de filtros y ordenamiento.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_CURRENT_SEARCH } from '../mocks/flightsMocks';
import { SearchQueryParams } from '../types/flight.types';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const savedSearch: SearchQueryParams = {
  origin: 'Lima',
  originIata: 'LIM',
  destination: 'Cusco',
  destinationIata: 'CUZ',
  departureDate: '18 sep',
  returnDate: '25 sep',
  passengers: 2,
  travelClass: 'Económica',
  tripType: 'ROUND_TRIP',
};

describe('flightService persisted search', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('window', globalThis);
    vi.stubGlobal('localStorage', storage);
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hidrata la última búsqueda guardada tras una carga nueva del servicio', async () => {
    const { LAST_FLIGHT_SEARCH_STORAGE_KEY } = await import('./flightService');
    storage.setItem(LAST_FLIGHT_SEARCH_STORAGE_KEY, JSON.stringify({ version: 1, params: savedSearch }));

    vi.resetModules();
    const { flightService } = await import('./flightService');

    await expect(flightService.getCurrentSearchParams()).resolves.toEqual(savedSearch);
    expect(flightService.hasPersistedSearch()).toBe(true);
  });

  it('actualiza y elimina la búsqueda persistida', async () => {
    const { flightService, LAST_FLIGHT_SEARCH_STORAGE_KEY } = await import('./flightService');

    flightService.setCurrentSearchParams(savedSearch);
    expect(storage.getItem(LAST_FLIGHT_SEARCH_STORAGE_KEY)).toContain('Cusco');
    expect(flightService.hasPersistedSearch()).toBe(true);

    flightService.clearPersistedSearch();
    expect(storage.getItem(LAST_FLIGHT_SEARCH_STORAGE_KEY)).toBeNull();
    expect(flightService.hasPersistedSearch()).toBe(false);
    await expect(flightService.getCurrentSearchParams()).resolves.toEqual(MOCK_CURRENT_SEARCH);
  });
});

describe('applyFiltersAndSort (función pura de filtrado y ordenamiento)', () => {
  const dummyFlights: any[] = [
    {
      id: 'f1',
      flightNumber: 'LA101',
      airline: { id: 1, name: 'LATAM Airlines', code: 'LA' },
      originIata: 'LIM',
      destinationIata: 'CUZ',
      price: 120,
      stopsCount: 0,
      durationMinutes: 80,
      timeOfDay: 'MORNING',
    },
    {
      id: 'f2',
      flightNumber: 'SK202',
      airline: { id: 2, name: 'Sky Airline', code: 'H2' },
      originIata: 'LIM',
      destinationIata: 'CUZ',
      price: 85,
      stopsCount: 1,
      durationMinutes: 140,
      timeOfDay: 'AFTERNOON',
    },
    {
      id: 'f3',
      flightNumber: 'JA303',
      airline: { id: 3, name: 'JetSMART', code: 'JA' },
      originIata: 'LIM',
      destinationIata: 'CUZ',
      price: 65,
      stopsCount: 2,
      durationMinutes: 200,
      timeOfDay: 'NIGHT',
    },
    {
      id: 'f4',
      flightNumber: 'LA104',
      airline: { id: 1, name: 'LATAM Airlines', code: 'LA' },
      originIata: 'LIM',
      destinationIata: 'CUZ',
      price: 250,
      stopsCount: 0,
      durationMinutes: 75,
      timeOfDay: 'NIGHT',
    },
  ];

  it('no muta el arreglo de entrada (función pura)', async () => {
    const { applyFiltersAndSort } = await import('./flightService');
    const snapshot = [...dummyFlights];
    const results = applyFiltersAndSort(dummyFlights, { priceRange: [50, 100] });

    expect(results).toHaveLength(2);
    expect(dummyFlights).toEqual(snapshot);
  });

  it('filtra correctamente por número de escalas (directo, 1 escala, 2+ escalas)', async () => {
    const { applyFiltersAndSort } = await import('./flightService');

    const directOnly = applyFiltersAndSort(dummyFlights, { stops: [0] });
    expect(directOnly.map((f) => f.id)).toEqual(['f1', 'f4']);

    const oneStopOnly = applyFiltersAndSort(dummyFlights, { stops: [1] });
    expect(oneStopOnly.map((f) => f.id)).toEqual(['f2']);

    const twoPlusOnly = applyFiltersAndSort(dummyFlights, { stops: [2] });
    expect(twoPlusOnly.map((f) => f.id)).toEqual(['f3']);

    const directOrOneStop = applyFiltersAndSort(dummyFlights, { stops: [0, 1] });
    expect(directOrOneStop.map((f) => f.id)).toEqual(['f2', 'f1', 'f4']);
  });

  it('filtra por rango de precio mínimo y máximo', async () => {
    const { applyFiltersAndSort } = await import('./flightService');
    const filtered = applyFiltersAndSort(dummyFlights, { priceRange: [80, 150] });

    expect(filtered.map((f) => f.id)).toEqual(['f2', 'f1']);
  });

  it('filtra por aerolínea insensible a mayúsculas/minúsculas o código', async () => {
    const { applyFiltersAndSort } = await import('./flightService');

    const latamOnly = applyFiltersAndSort(dummyFlights, { airlines: ['latam'] });
    expect(latamOnly.map((f) => f.id)).toEqual(['f1', 'f4']);

    const skyByCode = applyFiltersAndSort(dummyFlights, { airlines: ['h2'] });
    expect(skyByCode.map((f) => f.id)).toEqual(['f2']);
  });

  it('filtra por horario de salida (MORNING, AFTERNOON, NIGHT)', async () => {
    const { applyFiltersAndSort } = await import('./flightService');

    const morningOnly = applyFiltersAndSort(dummyFlights, { departureTimes: ['MORNING'] });
    expect(morningOnly.map((f) => f.id)).toEqual(['f1']);

    const nightOnly = applyFiltersAndSort(dummyFlights, { departureTimes: ['NIGHT'] });
    expect(nightOnly.map((f) => f.id)).toEqual(['f3', 'f4']);
  });

  it('combina múltiples criterios de filtrado simultáneos', async () => {
    const { applyFiltersAndSort } = await import('./flightService');

    const complexFilter = applyFiltersAndSort(dummyFlights, {
      stops: [0],
      priceRange: [100, 300],
      airlines: ['LATAM Airlines'],
      departureTimes: ['NIGHT'],
    });

    expect(complexFilter.map((f) => f.id)).toEqual(['f4']);
  });

  it('ordena por PRICE_ASC, DURATION_ASC y BEST', async () => {
    const { applyFiltersAndSort } = await import('./flightService');

    const byPriceAsc = applyFiltersAndSort(dummyFlights, undefined, 'PRICE_ASC');
    expect(byPriceAsc.map((f) => f.price)).toEqual([65, 85, 120, 250]);

    const byDurationAsc = applyFiltersAndSort(dummyFlights, undefined, 'DURATION_ASC');
    expect(byDurationAsc.map((f) => f.durationMinutes)).toEqual([75, 80, 140, 200]);

    const byBest = applyFiltersAndSort(dummyFlights, undefined, 'BEST');
    expect(byBest.length).toBe(4);
  });
});
