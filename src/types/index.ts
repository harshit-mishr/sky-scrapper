// Amadeus API Types
export interface Airport {
  iataCode: string;
  name: string;
  cityName?: string;
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  duration: string;
}

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: string;
    segments: FlightSegment[];
  }>;
  validatingAirlineCodes: string[];
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
}

export interface FlightSearchResponse {
  data: FlightOffer[];
  meta?: {
    count: number;
  };
}

// Filter Types
export interface Filters {
  stops: number[]; // [0, 1, 2] for non-stop, 1 stop, 2+ stops
  priceRange: [number, number];
  airlines: string[];
}

export type SortOption = 'price' | 'duration' | 'departure';

// UI State Types
export interface FlightState {
  flights: FlightOffer[];
  filteredFlights: FlightOffer[];
  loading: boolean;
  error: string | null;
  searchParams: FlightSearchParams | null;
  filters: Filters;
  sortBy: SortOption;
}

// Component Props
export interface FlightCardProps {
  flight: FlightOffer;
}

export interface PriceGraphProps {
  flights: FlightOffer[];
}

