import axios from 'axios';
import { FlightDetail, AlternativeFlight } from '../types/flightDetail.types';
import { MOCK_FLIGHT_DETAIL } from '../mocks/flightDetailMocks';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const flightDetailService = {
  /**
   * Obtiene los detalles completos de un vuelo real desde Spring Boot por su UUID o número de vuelo
   */
  async getFlightDetailById(flightId: string): Promise<FlightDetail> {
    try {
      const response = await axios.get<any>(`${API_BASE_URL}/flights/${flightId}`, {
        timeout: 4000,
      });

      const f = response.data;
      if (f && (f.flightId || f.id || f.flightNumber)) {
        const depDate = f.departureTime ? new Date(f.departureTime) : new Date();
        const arrDate = f.arrivalTime ? new Date(f.arrivalTime) : new Date();
        const duration = f.durationMinutes || 80;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        const dateFormatted = !isNaN(depDate.getTime())
          ? depDate.toLocaleDateString('es-PE', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'Lunes, 19 de Oct 2026';

        const baseFare = typeof f.basePrice === 'number' ? f.basePrice : Number(f.basePrice || 60);
        const taxes = Math.round(baseFare * 0.18 * 100) / 100;
        const total = Math.round((baseFare + taxes) * 100) / 100;

        // Buscar alternativas reales en la misma ruta
        let alternatives: AlternativeFlight[] = [];
        try {
          const altRes = await axios.get<any[]>(`${API_BASE_URL}/flights/search`, {
            params: {
              origin: f.origin?.iataCode,
              destination: f.destination?.iataCode,
            },
            timeout: 2500,
          });

          if (Array.isArray(altRes.data)) {
            alternatives = altRes.data
              .filter((alt) => (alt.flightId || alt.id) !== (f.flightId || f.id))
              .slice(0, 3)
              .map((alt) => {
                const altDep = alt.departureTime ? new Date(alt.departureTime) : new Date();
                const altArr = alt.arrivalTime ? new Date(alt.arrivalTime) : new Date();
                const altDur = alt.durationMinutes || 80;
                return {
                  id: String(alt.flightId || alt.id),
                  airline: {
                    id: alt.airline?.id || 1,
                    name: alt.airline?.name || 'Aerolínea',
                    code: alt.airline?.iataCode || 'LA',
                    colorBadge: 'primary',
                  },
                  departureTime: !isNaN(altDep.getTime())
                    ? altDep.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                    : '10:00',
                  arrivalTime: !isNaN(altArr.getTime())
                    ? altArr.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                    : '11:20',
                  durationFormatted: `${Math.floor(altDur / 60)}h ${altDur % 60}m`,
                  price: typeof alt.basePrice === 'number' ? alt.basePrice : 50,
                  currency: alt.currency || 'USD',
                };
              });
          }
        } catch {
          // Si falla alternatives, continúa con alternativas locales
        }

        return {
          id: String(f.flightId || f.id || flightId),
          flightNumber: f.flightNumber || 'FL-000',
          aircraftModel: f.aircraftModel || (f.airline?.name?.includes('LATAM') ? 'Airbus A320-200' : 'Airbus A321neo'),
          dateFormatted,
          airline: {
            id: f.airline?.id || 1,
            name: f.airline?.name || 'LATAM Airlines',
            code: f.airline?.iataCode || 'LA',
            colorBadge: 'primary',
          },
          originIata: f.origin?.iataCode || 'LIM',
          originAirportName: f.origin?.name || 'Aeropuerto Jorge Chávez',
          originCity: f.origin?.city || 'Lima',
          destinationIata: f.destination?.iataCode || 'CUZ',
          destinationAirportName: f.destination?.name || 'Aeropuerto Velasco Astete',
          destinationCity: f.destination?.city || 'Cusco',
          departureTime: !isNaN(depDate.getTime())
            ? depDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
            : '08:00',
          arrivalTime: !isNaN(arrDate.getTime())
            ? arrDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
            : '09:25',
          durationFormatted: `${hours}h ${minutes}min`,
          stopsCount: f.stopsCount || 0,
          stopsFormatted: (f.stopsCount || 0) === 0 ? 'Directo' : `${f.stopsCount} escala(s)`,
          amenitiesAndPolicies: [
            {
              id: 'amenity-1',
              title: 'Equipaje en cabina y bodega',
              description: 'Equipaje de mano de 10kg incluido de forma gratuita en cabina. Equipaje en bodega disponible según tarifa elegida.',
              iconType: 'baggage',
            },
            {
              id: 'amenity-2',
              title: 'Servicios a bordo',
              description: 'Conexión Wi-Fi satelital, bebidas y sistema de entretenimiento interactivo desde tu smartphone o pantalla personal.',
              iconType: 'services',
            },
            {
              id: 'amenity-3',
              title: 'Políticas de viaje',
              description: 'Flexibilidad de cambios de fecha sujeta a diferencias tarifarias. Embarque preferente para pasajeros con necesidades especiales.',
              iconType: 'policies',
            },
          ],
          fareSummary: {
            baseFare,
            baseFareDescription: 'Tarifa base (1 adulto)',
            taxesAndFees: taxes,
            totalPrice: total,
            currency: f.currency || 'USD',
          },
          externalBookingUrl: f.airline?.name?.toLowerCase().includes('latam')
            ? 'https://www.latamairlines.com'
            : f.airline?.name?.toLowerCase().includes('sky')
            ? 'https://www.skyairline.com'
            : 'https://www.jetsmart.com',
          alternatives: alternatives.length > 0 ? alternatives : MOCK_FLIGHT_DETAIL.alternatives,
        };
      }
    } catch (error) {
      console.warn('Backend flight detail no respondió, usando datos de respaldo:', error);
    }

    return MOCK_FLIGHT_DETAIL;
  },
};
