import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_FLIGHT_RESULTS } from '../mocks/flightsMocks';
import { ComparisonPriority } from '../types/compare.types';
import { FlightItem } from '../types/flight.types';
import { compareService } from './compareService';
import { flightService } from './flightService';

const getMockFlight = (flightId: string): FlightItem => {
  const flight = MOCK_FLIGHT_RESULTS.find(({ id }) => id === flightId);

  if (!flight) {
    throw new Error(`No existe el vuelo mock ${flightId}.`);
  }

  return flight;
};

describe('compareService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    [undefined, 'fl-002'],
    ['fl-001', undefined],
    ['fl-001', 'fl-001'],
  ])('rechaza una selección incompleta o duplicada', async (flightIdA, flightIdB) => {
    await expect(compareService.getFlightComparison(flightIdA, flightIdB)).rejects.toMatchObject({
      code: 'INVALID_SELECTION',
    });
  });

  it('rechaza identificadores que ya no existen en el catálogo', async () => {
    await expect(
      compareService.getFlightComparison('fl-001', 'fl-inexistente'),
    ).rejects.toMatchObject({ code: 'FLIGHT_NOT_FOUND' });
  });

  it('construye tarjetas y factores desde los vuelos seleccionados', async () => {
    const comparison = await compareService.getFlightComparison('fl-001', 'fl-003');

    expect(comparison.flightA).toMatchObject({ id: 'fl-001', flightNumber: 'H25021' });
    expect(comparison.flightB).toMatchObject({ id: 'fl-003', flightNumber: 'LA2040' });
    expect(comparison.specs).toHaveLength(10);
    expect(comparison.specs.find(({ id }) => id === 'spec-checkedbag')).toMatchObject({
      flightAValue: { text: 'Desde S/. 45' },
      flightBValue: { text: '23kg incluido', highlight: true },
    });
  });

  it('recomienda beneficios en el perfil equilibrado', async () => {
    const comparison = await compareService.getFlightComparison('fl-001', 'fl-003');

    expect(comparison.recommendation).toMatchObject({
      recommendedFlightId: 'fl-003',
      recommendedFlightNumber: 'LA2040',
      recommendedScore: 58,
      alternativeScore: 42,
      priority: 'BALANCED',
    });
  });

  it('cambia el ganador cuando el usuario prioriza el ahorro', async () => {
    const comparison = await compareService.getFlightComparison(
      'fl-001',
      'fl-003',
      'LOWEST_PRICE',
    );

    expect(comparison.recommendation).toMatchObject({
      recommendedFlightId: 'fl-001',
      recommendedFlightNumber: 'H25021',
      recommendedScore: 70,
      alternativeScore: 30,
      priority: 'LOWEST_PRICE',
    });
    expect(comparison.recommendation?.reasons).toContainEqual(
      expect.objectContaining({ text: expect.stringContaining('S/. 25') }),
    );
  });

  it('mantiene puntuaciones complementarias para todos los perfiles', async () => {
    const priorities: ComparisonPriority[] = [
      'BALANCED',
      'LOWEST_PRICE',
      'SHORTEST_TIME',
      'MOST_COMPLETE',
    ];

    const comparisons = await Promise.all(
      priorities.map((priority) =>
        compareService.getFlightComparison('fl-001', 'fl-003', priority),
      ),
    );

    comparisons.forEach(({ recommendation }) => {
      expect(recommendation).toBeDefined();
      expect(
        (recommendation?.recommendedScore ?? 0) + (recommendation?.alternativeScore ?? 0),
      ).toBe(100);
      expect(recommendation?.reasons.length).toBeGreaterThanOrEqual(3);
    });
  });

  it.each([
    ['DIFFERENT_ROUTE', { originIata: 'AQP' }],
    ['DIFFERENT_DATE', { departureDate: '2026-09-16' }],
    ['DIFFERENT_CURRENCY', { currency: 'USD' }],
    ['DIFFERENT_CABIN_CLASS', { cabinClass: 'Ejecutiva' }],
  ] as const)('rechaza vuelos incompatibles: %s', async (expectedCode, changes) => {
    const flightA = getMockFlight('fl-001');
    const flightB: FlightItem = { ...getMockFlight('fl-003'), ...changes };
    vi.spyOn(flightService, 'getFlightsByIds').mockResolvedValue([flightA, flightB]);

    await expect(
      compareService.getFlightComparison(flightA.id, flightB.id),
    ).rejects.toMatchObject({ code: expectedCode });
  });
});
