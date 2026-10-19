import axios from 'axios';
import { FlightTrackDetail, FlightChronologyEvent } from '../types/tracker.types';
import { MOCK_FLIGHT_TRACK } from '../mocks/trackerMocks';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const simulateDelay = <T>(data: T, ms: number = 300): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

export interface AlertConfigurationRequest {
  tripId?: string;
  notify24h?: boolean;
  notify3h?: boolean;
  notifyStatusChanges?: boolean;
  notifyDelays?: boolean;
  notifyArrival?: boolean;
  email?: string;
}

export interface AlertConfigurationResponse {
  message: string;
  activeAlerts: number;
}

export const trackerService = {
  /**
   * Consulta el estado de seguimiento de un vuelo por número y fecha desde el backend Spring Boot
   */
  async trackFlight(flightNumber: string = 'LA2010', date?: string): Promise<FlightTrackDetail> {
    const cleanFlightNumber = (flightNumber || 'LA2010').replace(/\s+/g, '').toUpperCase();

    try {
      const response = await axios.get<any>(`${API_BASE_URL}/flight-status/track/${cleanFlightNumber}`, {
        timeout: 45000,
      });
      const f = response.data;

      const depDate = f.departureTime ? new Date(f.departureTime) : new Date();
      const arrDate = f.arrivalTime ? new Date(f.arrivalTime) : new Date();
      const now = new Date();

      const diffMs = depDate.getTime() - now.getTime();
      const isUpcoming = diffMs > 0 && (f.status === 'SCHEDULED' || !f.status);

      let timeUntilDeparture = '';
      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) {
          timeUntilDeparture = `Faltan ${days} día(s) y ${hours}h para el vuelo`;
        } else if (hours > 0) {
          timeUntilDeparture = `Faltan ${hours}h y ${minutes}m para el despegue`;
        } else {
          timeUntilDeparture = `Faltan ${minutes} min para el despegue`;
        }
      }

      let progressPercentage = 0;
      let altitudeFormatted = 'En tierra (0 pies)';
      let speedFormatted = '0 km/h';
      let statusLabel = 'Programado';
      let punctualityLabel = 'A tiempo';
      let status = f.status || 'SCHEDULED';

      if (status === 'BOARDING') {
        progressPercentage = 8;
        altitudeFormatted = `En tierra (Puerta ${f.gate || '12'})`;
        speedFormatted = '0 km/h';
        statusLabel = 'Embarcando';
        punctualityLabel = 'A tiempo (Puerta abierta)';
      } else if (status === 'DELAYED') {
        progressPercentage = 0;
        altitudeFormatted = 'En tierra (Demorado)';
        speedFormatted = '0 km/h';
        statusLabel = 'Retrasado';
        punctualityLabel = 'Demora estimada de 30 min';
      } else if (status === 'DEPARTED' || status === 'IN_FLIGHT' || (!isUpcoming && now < arrDate && now >= depDate)) {
        status = 'IN_FLIGHT';
        const totalDurationMs = Math.max(arrDate.getTime() - depDate.getTime(), 1);
        const elapsedMs = Math.max(now.getTime() - depDate.getTime(), 0);
        progressPercentage = Math.min(Math.max(Math.round((elapsedMs / totalDurationMs) * 100), 12), 92);
        altitudeFormatted = '33,000 pies (10,058 m)';
        speedFormatted = '830 km/h (448 kts)';
        statusLabel = 'En vuelo';
        punctualityLabel = 'A tiempo en crucero';
      } else if (now >= arrDate && !isUpcoming) {
        status = 'LANDED';
        progressPercentage = 100;
        altitudeFormatted = 'En pista (Aterrizado)';
        speedFormatted = '0 km/h';
        statusLabel = 'Aterrizado';
        punctualityLabel = 'Llegada exitosa';
      } else {
        // Scheduled / Upcoming
        progressPercentage = 0;
        altitudeFormatted = 'En hangar / Plataforma';
        speedFormatted = '0 km/h';
        statusLabel = isUpcoming ? 'Programado' : 'A tiempo';
        punctualityLabel = 'A tiempo';
      }

      const depTimeFormatted = !isNaN(depDate.getTime())
        ? depDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
        : '08:00';
      const arrTimeFormatted = !isNaN(arrDate.getTime())
        ? arrDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
        : '09:25';

      const dateFormatted = !isNaN(depDate.getTime())
        ? depDate.toLocaleDateString('es-PE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : date || MOCK_FLIGHT_TRACK.dateFormatted;

      // Cronología dinámica basada en estado real
      const chronology: FlightChronologyEvent[] = [
        {
          id: 'evt-1',
          time: depTimeFormatted,
          title: 'Apertura de Mostradores y Check-in',
          description: `Mostrador de ${f.airline?.name || 'la aerolínea'} activo en ${f.origin?.name || 'origen'}.`,
          status: 'completed',
        },
        {
          id: 'evt-2',
          time: depTimeFormatted,
          title: `Embarque en Puerta ${f.gate || '12'}`,
          description: status === 'BOARDING' ? 'Embarque de pasajeros en curso.' : isUpcoming ? 'Embarque iniciará 45 min antes del vuelo.' : 'Embarque finalizado con éxito.',
          status: status === 'BOARDING' ? 'current' : isUpcoming ? 'upcoming' : 'completed',
        },
        {
          id: 'evt-3',
          time: depTimeFormatted,
          title: 'Despegue programado',
          description: `Pista de despegue en ${f.origin?.city || 'Lima'}.`,
          status: status === 'IN_FLIGHT' || status === 'LANDED' ? 'completed' : isUpcoming ? 'upcoming' : 'current',
        },
        {
          id: 'evt-4',
          time: arrTimeFormatted,
          title: `Aterrizaje en ${f.destination?.city || 'Cusco'}`,
          description: `Llegada a ${f.destination?.name || 'aeropuerto de destino'}.`,
          status: status === 'LANDED' ? 'completed' : 'upcoming',
        },
      ];

      return {
        ...MOCK_FLIGHT_TRACK,
        id: f.flightId ? String(f.flightId) : MOCK_FLIGHT_TRACK.id,
        flightNumber: f.flightNumber || cleanFlightNumber,
        airline: {
          id: f.airline?.id || 1,
          name: f.airline?.name || 'LATAM Airlines',
          code: f.airline?.iataCode || 'LA',
          iataCode: f.airline?.iataCode || 'LA',
          colorBadge: 'primary',
        },
        aircraftModel: f.aircraftModel || (f.airline?.name?.includes('LATAM') ? 'Airbus A320-200' : 'Airbus A321neo'),
        operatorName: f.airline?.name || 'LATAM Airlines',
        status,
        statusLabel,
        punctualityLabel,
        originIata: f.origin?.iataCode || 'LIM',
        originCity: f.origin?.city || 'Lima',
        originAirportName: f.origin?.name || 'Aeropuerto Internacional Jorge Chávez',
        destinationIata: f.destination?.iataCode || 'CUZ',
        destinationCity: f.destination?.city || 'Cusco',
        destinationAirportName: f.destination?.name || 'Aeropuerto Alejandro Velasco Astete',
        scheduledDepartureTime: depTimeFormatted,
        actualDepartureTime: depTimeFormatted,
        departureTerminalInfo: {
          terminal: f.terminal || 'T1',
          gate: f.gate || '12',
        },
        scheduledArrivalTime: arrTimeFormatted,
        estimatedArrivalTime: arrTimeFormatted,
        arrivalTerminalInfo: {
          terminal: 'T1',
          gate: '04',
        },
        durationFormatted: f.durationMinutes
          ? `${Math.floor(f.durationMinutes / 60)}h ${f.durationMinutes % 60}min`
          : '1h 15min',
        dateFormatted,
        telemetry: {
          altitudeFormatted,
          speedFormatted,
          progressPercentage,
          totalDistanceFormatted: `${(f.durationMinutes || 80) * 8} km`,
        },
        chronology,
        isUpcoming,
        timeUntilDeparture,
      };
    } catch (error) {
      console.warn('Backend tracking no disponible o vuelo no encontrado, usando respaldo:', error);
      return {
        ...MOCK_FLIGHT_TRACK,
        flightNumber: flightNumber || MOCK_FLIGHT_TRACK.flightNumber,
        dateFormatted: date || MOCK_FLIGHT_TRACK.dateFormatted,
      };
    }
  },

  /**
   * Configura las alertas simuladas de proximidad y cambios de estado (Módulo 05 / US-07)
   */
  async configureAlerts(payload: AlertConfigurationRequest): Promise<AlertConfigurationResponse> {
    if (USE_MOCKS) {
      await simulateDelay(null, 300);
      const activeCount = Object.entries(payload).filter(
        ([key, val]) => typeof val === 'boolean' && val === true
      ).length;

      return {
        message: 'Alertas configuradas con éxito',
        activeAlerts: activeCount || 2,
      };
    }

    return {
      message: 'Alertas configuradas con éxito',
      activeAlerts: 3,
    };
  },
};
