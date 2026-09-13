import { Flight, FlightSearchFormData } from '../../../types/flight.types';

// Simulamos una latencia de red de 1 segundo
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchFlightsMock = async (searchParams: FlightSearchFormData): Promise<Flight[]> => {
  await delay(1000);

  // Verificamos que tengamos origen y destino para poder "buscar"
  if (!searchParams.origin || !searchParams.destination) {
    return [];
  }

  const originCode = searchParams.origin.iataCode;
  const originCity = searchParams.origin.city;
  const destCode = searchParams.destination.iataCode;
  const destCity = searchParams.destination.city;

  // Fecha de salida formateada (tomamos la seleccionada en el form, si no hay, la de hoy)
  const departureDate = searchParams.departureDate 
    ? searchParams.departureDate.toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  const passengers = searchParams.passengers || 1;

  const results: Flight[] = [
    {
      flightId: 'a1b2c3d4-0000-0000-0000-000000000001',
      flightNumber: 'LA2040',
      airline: { id: 1, name: 'LATAM Airlines', iataCode: 'LA' },
      origin: { iataCode: originCode, city: originCity },
      destination: { iataCode: destCode, city: destCity },
      departureTime: `${departureDate}T08:30:00Z`,
      arrivalTime: `${departureDate}T09:55:00Z`,
      durationMinutes: 85,
      stopsCount: 0,
      basePrice: 64.99 * passengers,
      currency: 'USD',
      availableSeats: 12,
      status: 'SCHEDULED',
    },
    {
      flightId: 'b2c3d4e5-0000-0000-0000-000000000002',
      flightNumber: 'AV105',
      airline: { id: 2, name: 'Avianca', iataCode: 'AV' },
      origin: { iataCode: originCode, city: originCity },
      destination: { iataCode: destCode, city: destCity },
      departureTime: `${departureDate}T10:15:00Z`,
      arrivalTime: `${departureDate}T12:00:00Z`,
      durationMinutes: 105,
      stopsCount: 0,
      basePrice: 58.50 * passengers,
      currency: 'USD',
      availableSeats: 4,
      status: 'SCHEDULED',
    },
    {
      flightId: 'c3d4e5f6-0000-0000-0000-000000000003',
      flightNumber: 'H2501',
      airline: { id: 3, name: 'SKY Airline', iataCode: 'H2' },
      origin: { iataCode: originCode, city: originCity },
      destination: { iataCode: destCode, city: destCity },
      departureTime: `${departureDate}T06:00:00Z`,
      arrivalTime: `${departureDate}T07:20:00Z`,
      durationMinutes: 80,
      stopsCount: 0,
      basePrice: 45.00 * passengers,
      currency: 'USD',
      availableSeats: 25,
      status: 'SCHEDULED',
    },
    {
      flightId: 'd4e5f6g7-0000-0000-0000-000000000004',
      flightNumber: 'LA2055',
      airline: { id: 1, name: 'LATAM Airlines', iataCode: 'LA' },
      origin: { iataCode: originCode, city: originCity },
      destination: { iataCode: destCode, city: destCity },
      departureTime: `${departureDate}T18:45:00Z`,
      arrivalTime: `${departureDate}T20:15:00Z`,
      durationMinutes: 90,
      stopsCount: 0,
      basePrice: 72.00 * passengers,
      currency: 'USD',
      availableSeats: 8,
      status: 'SCHEDULED',
    },
    {
      flightId: 'e5f6g7h8-0000-0000-0000-000000000005',
      flightNumber: 'AV206',
      airline: { id: 2, name: 'Avianca', iataCode: 'AV' },
      origin: { iataCode: originCode, city: originCity },
      destination: { iataCode: destCode, city: destCity },
      departureTime: `${departureDate}T14:30:00Z`,
      arrivalTime: `${departureDate}T17:30:00Z`,
      durationMinutes: 180,
      stopsCount: 1,
      basePrice: 50.00 * passengers,
      currency: 'USD',
      availableSeats: 15,
      status: 'SCHEDULED',
    },
    {
      flightId: 'f6g7h8i9-0000-0000-0000-000000000006',
      flightNumber: 'H2511',
      airline: { id: 3, name: 'SKY Airline', iataCode: 'H2' },
      origin: { iataCode: originCode, city: originCity },
      destination: { iataCode: destCode, city: destCity },
      departureTime: `${departureDate}T22:00:00Z`,
      arrivalTime: `${departureDate}T23:25:00Z`,
      durationMinutes: 85,
      stopsCount: 0,
      basePrice: 40.00 * passengers,
      currency: 'USD',
      availableSeats: 30,
      status: 'SCHEDULED',
    }
  ];

  // Si la clase es Business o First Class, incrementamos los precios dinámicamente
  if (searchParams.travelClass === 'BUSINESS' || searchParams.travelClass === 'FIRST_CLASS') {
    const multiplier = searchParams.travelClass === 'BUSINESS' ? 2.5 : 4.0;
    return results.map(flight => ({
      ...flight,
      basePrice: flight.basePrice * multiplier
    }));
  }

  return results;
};
