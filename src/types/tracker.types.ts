import { Airline } from './flight.types';

export type FlightStatusType = 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'IN_FLIGHT' | 'LANDED' | 'DELAYED' | 'CANCELLED';

export interface FlightChronologyEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface FlightAirportTerminalInfo {
  terminal: string;
  gate: string;
}

export interface FlightTelemetry {
  altitudeFormatted: string;
  speedFormatted: string;
  progressPercentage: number;
  totalDistanceFormatted: string;
}

export interface FlightTrackDetail {
  id: string;
  flightNumber: string;
  airline: Airline;
  operatorName: string;
  aircraftModel: string;
  dateFormatted: string;
  status: FlightStatusType;
  statusLabel: string;
  punctualityLabel: string;
  originIata: string;
  originCity: string;
  originAirportName: string;
  scheduledDepartureTime: string;
  actualDepartureTime: string;
  departureTerminalInfo: FlightAirportTerminalInfo;
  destinationIata: string;
  destinationCity: string;
  destinationAirportName: string;
  scheduledArrivalTime: string;
  estimatedArrivalTime: string;
  arrivalTerminalInfo: FlightAirportTerminalInfo;
  durationFormatted: string;
  telemetry: FlightTelemetry;
  chronology: FlightChronologyEvent[];
  notificationSettings: {
    notifyStatusChanges: boolean;
    notifyDelays: boolean;
    notifyArrival: boolean;
  };
  isUpcoming?: boolean;
  timeUntilDeparture?: string;
}
