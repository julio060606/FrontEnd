import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface SavedTripFlight {
  flightId: string;
  flightNumber: string;
  airline: {
    id: number;
    iataCode: string;
    name: string;
    logoUrl?: string;
  };
  origin: {
    id: number;
    iataCode: string;
    city: string;
    name: string;
  };
  destination: {
    id: number;
    iataCode: string;
    city: string;
    name: string;
  };
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  durationMinutes: number;
  status: string;
  gate?: string;
  terminal?: string;
}

export interface UserTrip {
  tripId: string;
  flight: SavedTripFlight;
  bookingReference?: string | null;
  notes?: string | null;
  createdAt?: string | null;
}

export const tripService = {
  /**
   * Obtiene todos los viajes guardados en Supabase por el usuario autenticado
   */
  async getUserTrips(): Promise<UserTrip[]> {
    const token = authService.getToken();
    if (!token) return [];

    try {
      const response = await axios.get<UserTrip[]>(`${API_BASE_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000,
      });
      return response.data || [];
    } catch (error) {
      console.warn('Error al obtener mis viajes de backend:', error);
      return [];
    }
  },

  /**
   * Guarda un vuelo en el itinerario de Supabase del usuario actual
   */
  async saveTrip(flightId: string, notes: string = 'Guardado desde ChasquiFly', bookingReference?: string): Promise<UserTrip> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Debes iniciar sesión para guardar vuelos en tu itinerario.');
    }

    const payload = {
      flightId,
      notes,
      bookingReference: bookingReference || null,
    };

    const response = await axios.post<any>(`${API_BASE_URL}/trips`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 4000,
    });

    window.dispatchEvent(new CustomEvent('chasquifly:trips-change'));
    return response.data?.data || response.data;
  },

  /**
   * Elimina un viaje guardado del itinerario del usuario
   */
  async deleteTrip(tripId: string): Promise<void> {
    const token = authService.getToken();
    if (!token) return;

    await axios.delete(`${API_BASE_URL}/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 4000,
    });

    window.dispatchEvent(new CustomEvent('chasquifly:trips-change'));
  },
};
