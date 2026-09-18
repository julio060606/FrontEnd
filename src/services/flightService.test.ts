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
