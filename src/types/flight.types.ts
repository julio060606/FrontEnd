export interface Airport {
  id: number;
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

export type TravelClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST_CLASS';
export type TripType = 'ONE_WAY' | 'ROUND_TRIP';

export interface FlightSearchFormData {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate?: Date | null;
  passengers: number;
  travelClass: TravelClass;
}

export interface Airline {
  id: number;
  name: string;
  iataCode: string;
  logoUrl?: string;
}

export interface Flight {
  flightId: string;
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

