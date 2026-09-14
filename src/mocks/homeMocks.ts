import { PopularDestination, AiComparisonScenario, AirportOption } from '../types/home.types';

export const MOCK_AIRPORTS: AirportOption[] = [
  { id: 1, iataCode: 'LIM', name: 'Aeropuerto Internacional Jorge Chávez', city: 'Lima', country: 'Perú' },
  { id: 2, iataCode: 'CUZ', name: 'Aeropuerto Alejandro Velasco Astete', city: 'Cusco', country: 'Perú' },
  { id: 3, iataCode: 'AQP', name: 'Aeropuerto Rodríguez Ballón', city: 'Arequipa', country: 'Perú' },
  { id: 4, iataCode: 'IQT', name: 'Aeropuerto Crl. FAP Francisco Secada Vignetta', city: 'Iquitos', country: 'Perú' },
  { id: 5, iataCode: 'PIU', name: 'Aeropuerto Cap. FAP Guillermo Concha Iberico', city: 'Piura', country: 'Perú' },
  { id: 6, iataCode: 'TRU', name: 'Aeropuerto Capitán FAP Carlos Martínez de Pinillos', city: 'Trujillo', country: 'Perú' },
  { id: 7, iataCode: 'TCQ', name: 'Aeropuerto Crl. FAP Carlos Ciriani Santa Rosa', city: 'Tacna', country: 'Perú' },
];

export const MOCK_POPULAR_DESTINATIONS: PopularDestination[] = [
  {
    id: 'dest-cuz',
    city: 'Cusco',
    country: 'Perú',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=600&q=80',
    description: 'Vuelo directo ida/vuelta',
    priceFrom: 120,
    currency: 'S/.',
    tripTypeLabel: 'Vuelo directo ida/vuelta',
  },
  {
    id: 'dest-aqp',
    city: 'Arequipa',
    country: 'Perú',
    imageUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=600&q=80',
    description: 'Vuelo directo ida/vuelta',
    priceFrom: 135,
    currency: 'S/.',
    tripTypeLabel: 'Vuelo directo ida/vuelta',
  },
  {
    id: 'dest-iqt',
    city: 'Iquitos',
    country: 'Perú',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description: 'Vuelo directo ida/vuelta',
    priceFrom: 150,
    currency: 'S/.',
    tripTypeLabel: 'Vuelo directo ida/vuelta',
  },
  {
    id: 'dest-piu',
    city: 'Piura',
    country: 'Perú',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Vuelo directo ida/vuelta',
    priceFrom: 110,
    currency: 'S/.',
    tripTypeLabel: 'Vuelo directo ida/vuelta',
  },
];

export const MOCK_AI_COMPARISON_SCENARIO: AiComparisonScenario = {
  id: 'scenario-lim-cuz',
  origin: 'Lima (LIM)',
  destination: 'Cusco (CUZ)',
  dateFormatted: '15 Sep 2025',
  modality: 'Ida y Vuelta',
  flight1: {
    id: 'fl-001',
    airlineName: 'Sky Airline',
    flightNumber: 'H25021',
    origin: 'LIM',
    destination: 'CUZ',
    price: 120,
    currency: 'S/.',
    durationFormatted: '1h 20m',
    stopsCount: 0,
  },
  flight2: {
    id: 'fl-003',
    airlineName: 'LATAM',
    flightNumber: 'LA2040',
    origin: 'LIM',
    destination: 'CUZ',
    price: 145,
    currency: 'S/.',
    durationFormatted: '1h 15m',
    stopsCount: 0,
  },
};
