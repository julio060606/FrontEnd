import {
  AIRecommendation,
  CompareFlightCardData,
  CompareSpecItem,
  CompareSpecValue,
  ComparisonPriority,
  FlightComparisonData,
} from '../types/compare.types';
import { FlightItem } from '../types/flight.types';
import { flightService } from './flightService';

type RecommendationMetric =
  | 'price'
  | 'duration'
  | 'stops'
  | 'baggage'
  | 'comfort'
  | 'flexibility'
  | 'punctuality';

type RecommendationWeights = Record<RecommendationMetric, number>;

interface ScoringMetric {
  id: RecommendationMetric;
  valueA: number;
  valueB: number;
  higherIsBetter: boolean;
  reasonA: AIRecommendation['reasons'][number];
  reasonB: AIRecommendation['reasons'][number];
}

type WeightedReason = AIRecommendation['reasons'][number] & {
  weight: number;
};

const PRIORITY_LABELS: Record<ComparisonPriority, string> = {
  BALANCED: 'Equilibrado',
  LOWEST_PRICE: 'Ahorrar',
  SHORTEST_TIME: 'Llegar antes',
  MOST_COMPLETE: 'Más servicios',
};

const PRIORITY_WEIGHTS: Record<ComparisonPriority, RecommendationWeights> = {
  BALANCED: {
    price: 25,
    duration: 20,
    stops: 15,
    baggage: 15,
    comfort: 10,
    flexibility: 5,
    punctuality: 10,
  },
  LOWEST_PRICE: {
    price: 60,
    duration: 10,
    stops: 10,
    baggage: 5,
    comfort: 5,
    flexibility: 0,
    punctuality: 10,
  },
  SHORTEST_TIME: {
    price: 10,
    duration: 55,
    stops: 20,
    baggage: 0,
    comfort: 0,
    flexibility: 0,
    punctuality: 15,
  },
  MOST_COMPLETE: {
    price: 5,
    duration: 5,
    stops: 5,
    baggage: 30,
    comfort: 20,
    flexibility: 20,
    punctuality: 15,
  },
};

export type FlightComparisonErrorCode =
  | 'INVALID_SELECTION'
  | 'FLIGHT_NOT_FOUND'
  | 'DIFFERENT_ROUTE'
  | 'DIFFERENT_DATE'
  | 'DIFFERENT_CURRENCY'
  | 'DIFFERENT_CABIN_CLASS';

export class FlightComparisonError extends Error {
  constructor(
    public readonly code: FlightComparisonErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'FlightComparisonError';
  }
}

const formatPrice = (currency: string, price: number): string =>
  `${currency} ${Number.isInteger(price) ? price : price.toFixed(2)}`;

const comparisonHighlights = (
  valueA: number,
  valueB: number,
  higherIsBetter = false,
): [boolean, boolean] => {
  if (valueA === valueB) {
    return [false, false];
  }

  return higherIsBetter
    ? [valueA > valueB, valueB > valueA]
    : [valueA < valueB, valueB < valueA];
};

const buildTextValue = (text: string, highlight = false): CompareSpecValue => ({
  text,
  highlight,
  isPositive: highlight || undefined,
});

const buildBooleanValue = (
  available: boolean,
  highlight: boolean,
  availableText = 'Disponible',
  unavailableText = 'No disponible',
): CompareSpecValue => ({
  text: available ? availableText : unavailableText,
  hasCheckIcon: available,
  hasCrossIcon: !available,
  isNegative: !available,
  highlight,
  isPositive: highlight || undefined,
});

const buildCheckedBaggageValue = (
  flight: FlightItem,
  highlight: boolean,
): CompareSpecValue => {
  const { amenities } = flight;

  if (amenities.checkedBaggageIncluded) {
    return {
      text: amenities.checkedBaggageKg
        ? `${amenities.checkedBaggageKg}kg incluido`
        : 'Incluido',
      hasCheckIcon: true,
      highlight,
      isPositive: highlight || undefined,
    };
  }

  return {
    text: amenities.checkedBaggagePrice !== undefined
      ? `Desde ${formatPrice(flight.currency, amenities.checkedBaggagePrice)}`
      : 'No incluido',
    hasCheckIcon: amenities.checkedBaggagePrice !== undefined,
    hasCrossIcon: amenities.checkedBaggagePrice === undefined,
    isNegative: amenities.checkedBaggagePrice === undefined,
    highlight,
    isPositive: highlight || undefined,
  };
};

const buildChangeValue = (flight: FlightItem, highlight: boolean): CompareSpecValue => {
  const { amenities } = flight;

  if (!amenities.changeAllowed) {
    return {
      text: 'Sin cambios',
      hasCrossIcon: true,
      isNegative: true,
    };
  }

  return {
    text: amenities.changeFee !== undefined
      ? `Cambio desde ${formatPrice(flight.currency, amenities.changeFee)}`
      : 'Cambios incluidos',
    hasCheckIcon: true,
    highlight,
    isPositive: highlight || undefined,
  };
};

const getCheckedBaggageScore = (flight: FlightItem): number => {
  if (flight.amenities.checkedBaggageIncluded) {
    return 10_000 + (flight.amenities.checkedBaggageKg ?? 0);
  }

  return -(flight.amenities.checkedBaggagePrice ?? 10_000);
};

const getChangeScore = (flight: FlightItem): number => {
  if (!flight.amenities.changeAllowed) {
    return -10_000;
  }

  return -(flight.amenities.changeFee ?? 0);
};

const formatMinutesDifference = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
};

const getComfortScore = (flight: FlightItem): number =>
  Number(flight.amenities.wifiAvailable) + Number(flight.amenities.snacksIncluded);

const describeComfort = (flight: FlightItem): string => {
  const services: string[] = [];

  if (flight.amenities.wifiAvailable) {
    services.push('Wi-Fi');
  }
  if (flight.amenities.snacksIncluded) {
    services.push('snacks y bebidas');
  }

  return services.length > 0 ? `incluye ${services.join(' y ')}.` : 'ofrece más servicios a bordo.';
};

const describeBaggage = (flight: FlightItem): string => {
  if (flight.amenities.checkedBaggageIncluded) {
    const checkedBaggage = flight.amenities.checkedBaggageKg
      ? `${flight.amenities.checkedBaggageKg} kg en bodega`
      : 'equipaje en bodega';
    return `incluye ${checkedBaggage} y ${flight.amenities.carryOnKg} kg de mano.`;
  }

  return `permite ${flight.amenities.carryOnKg} kg de equipaje de mano.`;
};

const describeFlexibility = (flight: FlightItem): string => {
  if (!flight.amenities.changeAllowed) {
    return 'presenta mejores condiciones de cambio.';
  }

  if (flight.amenities.changeFee === undefined) {
    return 'permite cambios sin penalidad.';
  }

  return `permite cambios desde ${formatPrice(flight.currency, flight.amenities.changeFee)}.`;
};

const buildScoringMetrics = (flightA: FlightItem, flightB: FlightItem): ScoringMetric[] => [
  {
    id: 'price',
    valueA: flightA.price,
    valueB: flightB.price,
    higherIsBetter: false,
    reasonA: {
      id: 'reason-price-a',
      highlightText: 'Mejor precio:',
      text: `ahorras ${formatPrice(flightA.currency, Math.abs(flightB.price - flightA.price))} frente a ${flightB.airline.name}.`,
    },
    reasonB: {
      id: 'reason-price-b',
      highlightText: 'Mejor precio:',
      text: `ahorras ${formatPrice(flightB.currency, Math.abs(flightA.price - flightB.price))} frente a ${flightA.airline.name}.`,
    },
  },
  {
    id: 'duration',
    valueA: flightA.durationMinutes,
    valueB: flightB.durationMinutes,
    higherIsBetter: false,
    reasonA: {
      id: 'reason-duration-a',
      highlightText: 'Menor duración:',
      text: `el trayecto dura ${formatMinutesDifference(Math.abs(flightB.durationMinutes - flightA.durationMinutes))} menos.`,
    },
    reasonB: {
      id: 'reason-duration-b',
      highlightText: 'Menor duración:',
      text: `el trayecto dura ${formatMinutesDifference(Math.abs(flightA.durationMinutes - flightB.durationMinutes))} menos.`,
    },
  },
  {
    id: 'stops',
    valueA: flightA.stopsCount,
    valueB: flightB.stopsCount,
    higherIsBetter: false,
    reasonA: {
      id: 'reason-stops-a',
      highlightText: 'Ruta más directa:',
      text: `${flightA.stopsFormatted.toLowerCase()} frente a ${flightB.stopsFormatted.toLowerCase()}.`,
    },
    reasonB: {
      id: 'reason-stops-b',
      highlightText: 'Ruta más directa:',
      text: `${flightB.stopsFormatted.toLowerCase()} frente a ${flightA.stopsFormatted.toLowerCase()}.`,
    },
  },
  {
    id: 'baggage',
    valueA: getCheckedBaggageScore(flightA) + flightA.amenities.carryOnKg,
    valueB: getCheckedBaggageScore(flightB) + flightB.amenities.carryOnKg,
    higherIsBetter: true,
    reasonA: { id: 'reason-baggage-a', highlightText: 'Mejor equipaje:', text: describeBaggage(flightA) },
    reasonB: { id: 'reason-baggage-b', highlightText: 'Mejor equipaje:', text: describeBaggage(flightB) },
  },
  {
    id: 'comfort',
    valueA: getComfortScore(flightA),
    valueB: getComfortScore(flightB),
    higherIsBetter: true,
    reasonA: { id: 'reason-comfort-a', highlightText: 'Más comodidad:', text: describeComfort(flightA) },
    reasonB: { id: 'reason-comfort-b', highlightText: 'Más comodidad:', text: describeComfort(flightB) },
  },
  {
    id: 'flexibility',
    valueA: getChangeScore(flightA),
    valueB: getChangeScore(flightB),
    higherIsBetter: true,
    reasonA: { id: 'reason-flexibility-a', highlightText: 'Mayor flexibilidad:', text: describeFlexibility(flightA) },
    reasonB: { id: 'reason-flexibility-b', highlightText: 'Mayor flexibilidad:', text: describeFlexibility(flightB) },
  },
  {
    id: 'punctuality',
    valueA: flightA.amenities.punctualityPercentage,
    valueB: flightB.amenities.punctualityPercentage,
    higherIsBetter: true,
    reasonA: {
      id: 'reason-punctuality-a',
      highlightText: 'Mejor puntualidad:',
      text: `${flightA.amenities.punctualityPercentage}% de puntualidad promedio.`,
    },
    reasonB: {
      id: 'reason-punctuality-b',
      highlightText: 'Mejor puntualidad:',
      text: `${flightB.amenities.punctualityPercentage}% de puntualidad promedio.`,
    },
  },
];

const buildRecommendation = (
  flightA: FlightItem,
  flightB: FlightItem,
  priority: ComparisonPriority,
): AIRecommendation => {
  const weights = PRIORITY_WEIGHTS[priority];
  const reasonsA: WeightedReason[] = [];
  const reasonsB: WeightedReason[] = [];
  let scoreA = 0;
  let scoreB = 0;

  buildScoringMetrics(flightA, flightB).forEach((metric) => {
    const weight = weights[metric.id];

    if (metric.valueA === metric.valueB) {
      scoreA += weight / 2;
      scoreB += weight / 2;
      return;
    }

    const flightAWins = metric.higherIsBetter
      ? metric.valueA > metric.valueB
      : metric.valueA < metric.valueB;

    if (flightAWins) {
      scoreA += weight;
      if (weight > 0) {
        reasonsA.push({ ...metric.reasonA, weight });
      }
    } else {
      scoreB += weight;
      if (weight > 0) {
        reasonsB.push({ ...metric.reasonB, weight });
      }
    }
  });

  const flightAIsRecommended = scoreA === scoreB
    ? flightA.price < flightB.price
      || (flightA.price === flightB.price && flightA.durationMinutes <= flightB.durationMinutes)
    : scoreA > scoreB;
  const recommendedFlight = flightAIsRecommended ? flightA : flightB;
  const alternativeFlight = flightAIsRecommended ? flightB : flightA;
  const recommendedScore = Math.round(flightAIsRecommended ? scoreA : scoreB);
  const alternativeScore = 100 - recommendedScore;
  const winningReasons = flightAIsRecommended ? reasonsA : reasonsB;
  const reasons = winningReasons
    .sort((reasonA, reasonB) => reasonB.weight - reasonA.weight)
    .slice(0, 3)
    .map(({ weight: _weight, ...reason }) => reason);

  if (reasons.length < 3) {
    reasons.push({
      id: 'reason-schedule',
      highlightText: 'Horario:',
      text: `sale a las ${recommendedFlight.departureTime} y llega a las ${recommendedFlight.arrivalTime}.`,
    });
  }

  if (reasons.length < 3 && flightA.durationMinutes === flightB.durationMinutes) {
    reasons.push({
      id: 'reason-duration-tie',
      highlightText: 'Misma duración:',
      text: `ambas opciones completan el trayecto en ${recommendedFlight.durationFormatted}.`,
    });
  }

  if (reasons.length < 3 && flightA.stopsCount === flightB.stopsCount) {
    reasons.push({
      id: 'reason-stops-tie',
      highlightText: 'Mismo itinerario:',
      text: `ambas opciones son ${recommendedFlight.stopsFormatted.toLowerCase()}.`,
    });
  }

  return {
    recommendedFlightId: recommendedFlight.id,
    recommendedFlightNumber: recommendedFlight.flightNumber,
    recommendedAirlineName: recommendedFlight.airline.name,
    alternativeFlightNumber: alternativeFlight.flightNumber,
    alternativeAirlineName: alternativeFlight.airline.name,
    recommendedScore,
    alternativeScore,
    priority,
    priorityLabel: PRIORITY_LABELS[priority],
    title: `Te recomendamos ${recommendedFlight.airline.name} ${recommendedFlight.flightNumber}`,
    description: `Con el perfil ${PRIORITY_LABELS[priority].toLowerCase()}, esta opción obtiene ${recommendedScore}/100 frente a ${alternativeScore}/100.`,
    reasons,
    disclaimer: 'Puntuación orientativa calculada con los precios y servicios simulados del Sprint 1. Revisa las condiciones finales antes de comprar.',
  };
};

const mapFlightToCard = (
  flight: FlightItem,
  isCheapest: boolean,
): CompareFlightCardData => ({
  id: flight.id,
  airline: flight.airline,
  flightNumber: flight.flightNumber,
  cabinClass: flight.cabinClass,
  routeLabel: `${flight.originIata} → ${flight.destinationIata}`,
  departureDate: flight.departureDate,
  returnDate: flight.returnDate,
  departureTime: flight.departureTime,
  departureIata: flight.originIata,
  arrivalTime: flight.arrivalTime,
  arrivalIata: flight.destinationIata,
  durationFormatted: flight.durationFormatted,
  stopsFormatted: flight.stopsFormatted,
  price: flight.price,
  currency: flight.currency,
  isCheapest,
});

const buildComparisonSpecs = (flightA: FlightItem, flightB: FlightItem): CompareSpecItem[] => {
  const [priceABetter, priceBBetter] = comparisonHighlights(flightA.price, flightB.price);
  const [durationABetter, durationBBetter] = comparisonHighlights(
    flightA.durationMinutes,
    flightB.durationMinutes,
  );
  const [stopsABetter, stopsBBetter] = comparisonHighlights(
    flightA.stopsCount,
    flightB.stopsCount,
  );
  const [carryOnABetter, carryOnBBetter] = comparisonHighlights(
    flightA.amenities.carryOnKg,
    flightB.amenities.carryOnKg,
    true,
  );
  const [checkedBagABetter, checkedBagBBetter] = comparisonHighlights(
    getCheckedBaggageScore(flightA),
    getCheckedBaggageScore(flightB),
    true,
  );
  const [punctualityABetter, punctualityBBetter] = comparisonHighlights(
    flightA.amenities.punctualityPercentage,
    flightB.amenities.punctualityPercentage,
    true,
  );
  const [changeABetter, changeBBetter] = comparisonHighlights(
    getChangeScore(flightA),
    getChangeScore(flightB),
    true,
  );

  return [
    {
      id: 'spec-price',
      factorName: 'Precio',
      flightAValue: buildTextValue(formatPrice(flightA.currency, flightA.price), priceABetter),
      flightBValue: buildTextValue(formatPrice(flightB.currency, flightB.price), priceBBetter),
    },
    {
      id: 'spec-departure-time',
      factorName: 'Hora de salida',
      flightAValue: buildTextValue(flightA.departureTime),
      flightBValue: buildTextValue(flightB.departureTime),
    },
    {
      id: 'spec-duration',
      factorName: 'Duración',
      flightAValue: buildTextValue(flightA.durationFormatted, durationABetter),
      flightBValue: buildTextValue(flightB.durationFormatted, durationBBetter),
    },
    {
      id: 'spec-stops',
      factorName: 'Escalas',
      flightAValue: buildTextValue(flightA.stopsFormatted, stopsABetter),
      flightBValue: buildTextValue(flightB.stopsFormatted, stopsBBetter),
    },
    {
      id: 'spec-carryon',
      factorName: 'Equipaje de mano',
      flightAValue: buildTextValue(`${flightA.amenities.carryOnKg}kg incluido`, carryOnABetter),
      flightBValue: buildTextValue(`${flightB.amenities.carryOnKg}kg incluido`, carryOnBBetter),
    },
    {
      id: 'spec-checkedbag',
      factorName: 'Equipaje en bodega',
      flightAValue: buildCheckedBaggageValue(flightA, checkedBagABetter),
      flightBValue: buildCheckedBaggageValue(flightB, checkedBagBBetter),
    },
    {
      id: 'spec-wifi',
      factorName: 'Wi-Fi a bordo',
      flightAValue: buildBooleanValue(
        flightA.amenities.wifiAvailable,
        flightA.amenities.wifiAvailable && !flightB.amenities.wifiAvailable,
      ),
      flightBValue: buildBooleanValue(
        flightB.amenities.wifiAvailable,
        flightB.amenities.wifiAvailable && !flightA.amenities.wifiAvailable,
      ),
    },
    {
      id: 'spec-snacks',
      factorName: 'Snacks/Bebidas',
      flightAValue: buildBooleanValue(
        flightA.amenities.snacksIncluded,
        flightA.amenities.snacksIncluded && !flightB.amenities.snacksIncluded,
        'Incluido',
        'No incluido',
      ),
      flightBValue: buildBooleanValue(
        flightB.amenities.snacksIncluded,
        flightB.amenities.snacksIncluded && !flightA.amenities.snacksIncluded,
        'Incluido',
        'No incluido',
      ),
    },
    {
      id: 'spec-flexibility',
      factorName: 'Flexibilidad de cambio',
      flightAValue: buildChangeValue(flightA, changeABetter),
      flightBValue: buildChangeValue(flightB, changeBBetter),
    },
    {
      id: 'spec-punctuality',
      factorName: 'Puntualidad promedio',
      flightAValue: buildTextValue(
        `${flightA.amenities.punctualityPercentage}%`,
        punctualityABetter,
      ),
      flightBValue: buildTextValue(
        `${flightB.amenities.punctualityPercentage}%`,
        punctualityBBetter,
      ),
    },
  ];
};

const validateComparableFlights = (flightA: FlightItem, flightB: FlightItem): void => {
  if (
    flightA.originIata !== flightB.originIata
    || flightA.destinationIata !== flightB.destinationIata
  ) {
    throw new FlightComparisonError(
      'DIFFERENT_ROUTE',
      'Los vuelos deben tener el mismo origen y destino para compararlos.',
    );
  }

  if (
    flightA.departureDate !== flightB.departureDate
    || flightA.returnDate !== flightB.returnDate
  ) {
    throw new FlightComparisonError(
      'DIFFERENT_DATE',
      'Los vuelos deben corresponder a las mismas fechas de viaje.',
    );
  }

  if (flightA.currency !== flightB.currency) {
    throw new FlightComparisonError(
      'DIFFERENT_CURRENCY',
      'Los precios deben estar expresados en la misma moneda.',
    );
  }

  if (flightA.cabinClass !== flightB.cabinClass) {
    throw new FlightComparisonError(
      'DIFFERENT_CABIN_CLASS',
      'Los vuelos deben pertenecer a la misma clase de cabina.',
    );
  }
};

export const compareService = {
  /**
   * Construye la comparación a partir de dos vuelos reales del catálogo mock.
   */
  async getFlightComparison(
    flightIdA?: string,
    flightIdB?: string,
    priority: ComparisonPriority = 'BALANCED',
  ): Promise<FlightComparisonData> {
    if (!flightIdA || !flightIdB || flightIdA === flightIdB) {
      throw new FlightComparisonError(
        'INVALID_SELECTION',
        'Selecciona dos vuelos diferentes para iniciar la comparación.',
      );
    }

    const [flightA, flightB] = await flightService.getFlightsByIds([flightIdA, flightIdB]);

    if (!flightA || !flightB) {
      throw new FlightComparisonError(
        'FLIGHT_NOT_FOUND',
        'Uno o ambos vuelos ya no están disponibles en los resultados.',
      );
    }

    validateComparableFlights(flightA, flightB);

    return {
      flightA: mapFlightToCard(flightA, flightA.price < flightB.price),
      flightB: mapFlightToCard(flightB, flightB.price < flightA.price),
      specs: buildComparisonSpecs(flightA, flightB),
      recommendation: buildRecommendation(flightA, flightB, priority),
    };
  },
};
