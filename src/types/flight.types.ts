export type FlightStopType = 'DIRECT' | 'ONE_STOP' | 'TWO_PLUS_STOPS';
export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'NIGHT';
export type SortOption = 'PRICE_ASC' | 'DURATION_ASC' | 'BEST';

export interface Airline {
  id: string;
  name: string;
  code: string;
  colorBadge: 'success' | 'warning' | 'primary' | 'error' | 'info';
  logoUrl?: string;
}

export interface BaggagePolicy {
  personalItem: boolean;
  carryOn: boolean;
  checkedBag: boolean;
}

export interface StopDetail {
  airportIata: string;
  airportCity: string;
  layoverDuration: string;
}

export interface FlightItem {
  id: string;
  airline: Airline;
  cabinClass: string;
  flightNumber: string;
  originIata: string;
  originCity: string;
  destinationIata: string;
  destinationCity: string;
  departureTime: string; // "14:20"
  arrivalTime: string;   // "15:40"
  durationFormatted: string; // "1h 20m"
  durationMinutes: number;
  stopsCount: number;
  stopsFormatted: string; // "Directo" | "1 escala" | "2+ escalas"
  stopsDetails?: StopDetail[];
  price: number;
  currency: string;
  tripTypeLabel: string; // "Ida y vuelta" | "Solo ida"
  timeOfDay: TimeOfDay;
  badgeOffer?: string; // "Más barato" | "Recomendado" | "Más rápido" | "Oferta relámpago"
  baggageIncluded?: BaggagePolicy;
}

export interface FlightFilterState {
  stops: number[]; // [0, 1, 2]
  priceRange: [number, number]; // [80, 500]
  airlines: string[]; // airline names / ids
  departureTimes: TimeOfDay[]; // ['MORNING', 'AFTERNOON', 'NIGHT']
}

export interface SearchQueryParams {
  origin: string;
  originIata: string;
  destination: string;
  destinationIata: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  travelClass: string;
}

