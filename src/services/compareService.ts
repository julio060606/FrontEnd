import {
  CompareFlightCardData,
  CompareSpecItem,
  CompareSpecValue,
  FlightComparisonData,
} from '../types/compare.types';
import { FlightItem } from '../types/flight.types';
import { flightService } from './flightService';

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
    };
  },
};
