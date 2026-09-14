export interface Airport {
  id: number;
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

export type TravelClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST_CLASS';
export type TripType = 'ONE_WAY' | 'ROUND_TRIP';
export type FlightStopType = 'DIRECT' | 'ONE_STOP' | 'TWO_PLUS_STOPS';
export type TimeOfDay = 'MORNING' | 'AFTERNOON' | 'NIGHT';
export type SortOption = 'PRICE_ASC' | 'DURATION_ASC' | 'BEST';

export interface FlightSearchFormData {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate?: Date | null;
  passengers: number;
  travelClass: TravelClass;
}

/**
 * Interfaz unificada de Aerolínea para soportar tanto identificadores numéricos/alfanuméricos
 * como los badges y códigos requeridos por los módulos de US04, US05 y US06.
 */
export interface Airline {
  id: string | number;
  name: string;
  code?: string;
  iataCode?: string;
  colorBadge?: 'success' | 'warning' | 'primary' | 'error' | 'info';
  logoUrl?: string;
}

export interface FlightAmenities {
  carryOnKg: number;
  checkedBaggageIncluded: boolean;
  checkedBaggageKg?: number;
  checkedBaggagePrice?: number;
  wifiAvailable: boolean;
  snacksIncluded: boolean;
  changeAllowed: boolean;
  changeFee?: number;
  punctualityPercentage: number;
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

export interface Flight {
  flightId: string;
  flightNumber: string;
  airline: Airline;
  origin: Pick<Airport, 'iataCode' | 'city'>;
  destination: Pick<Airport, 'iataCode' | 'city'>;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stopsCount: number;
  basePrice: number;
  currency: string;
  availableSeats: number;
  status: 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED';
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
  departureDate: string;
  returnDate?: string;
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
  amenities: FlightAmenities;
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
  tripType?: TripType;
}
