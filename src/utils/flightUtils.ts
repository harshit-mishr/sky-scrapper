import type { FlightOffer, Filters, SortOption } from '../types';

/**
 * Calculate total number of stops for a flight itinerary
 */
export function getStopsCount(flight: FlightOffer): number {
  if (!flight || !flight.itineraries || flight.itineraries.length === 0) {
    return 0;
  }

  // For round trips, check the outbound flight
  const itinerary = flight.itineraries[0];
  if (!itinerary || !itinerary.segments || !Array.isArray(itinerary.segments)) {
    return 0;
  }

  const segments = itinerary.segments;
  return Math.max(0, segments.length - 1);
}

/**
 * Get formatted duration string
 */
export function formatDuration(duration: string): string {
  // Duration format: "PT2H30M" -> "2h 30m"
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? `${match[1]}h` : '';
  const minutes = match[2] ? `${match[2]}m` : '';
  return `${hours} ${minutes}`.trim() || duration;
}

/**
 * Format time from ISO string to readable format
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date to readable format
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get airline name from carrier code
 * In production, this would fetch from an airline database
 */
export function getAirlineName(carrierCode: string): string {
  const airlineMap: Record<string, string> = {
    'AA': 'American Airlines',
    'UA': 'United Airlines',
    'DL': 'Delta Air Lines',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines',
    'VS': 'Virgin Atlantic',
    'AC': 'Air Canada',
    'AS': 'Alaska Airlines',
    'WN': 'Southwest Airlines',
    'B6': 'JetBlue',
  };

  return airlineMap[carrierCode] || carrierCode;
}

/**
 * Parse price string to number
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString) || 0;
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Filter flights based on criteria
 */
export function filterFlights(
  flights: FlightOffer[],
  filters: Filters
): FlightOffer[] {
  if (!flights || !Array.isArray(flights)) {
    return [];
  }

  if (!filters || typeof filters !== 'object') {
    return flights;
  }

  return flights.filter((flight) => {
    // Validate flight object
    if (!flight || typeof flight !== 'object') {
      return false;
    }

    // Filter by stops
    try {
      const stops = getStopsCount(flight);
      let stopCategory: number;
      if (stops === 0) stopCategory = 0;
      else if (stops === 1) stopCategory = 1;
      else stopCategory = 2;

      if (filters.stops && Array.isArray(filters.stops) && filters.stops.length > 0 && !filters.stops.includes(stopCategory)) {
        return false;
      }
    } catch (error) {
      console.error('Error filtering by stops:', error, flight);
      return false;
    }

    // Filter by price range
    try {
      if (flight.price && flight.price.total && filters.priceRange && Array.isArray(filters.priceRange)) {
        const price = parsePrice(flight.price.total);
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }
      }
    } catch (error) {
      console.error('Error filtering by price:', error, flight);
      return false;
    }

    // Filter by airlines
    if (filters.airlines && Array.isArray(filters.airlines) && filters.airlines.length > 0) {
      try {
        const flightAirlines = (flight.validatingAirlineCodes && Array.isArray(flight.validatingAirlineCodes)) 
          ? flight.validatingAirlineCodes 
          : [];
        const hasMatchingAirline = flightAirlines.some((code) =>
          filters.airlines.includes(code)
        );
        if (!hasMatchingAirline) {
          return false;
        }
      } catch (error) {
        console.error('Error filtering by airlines:', error, flight);
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort flights by the specified option
 */
export function sortFlights(
  flights: FlightOffer[],
  sortBy: SortOption
): FlightOffer[] {
  const sorted = [...flights];

  switch (sortBy) {
    case 'price':
      return sorted.sort(
        (a, b) => parsePrice(a.price.total) - parsePrice(b.price.total)
      );

    case 'duration':
      return sorted.sort((a, b) => {
        if (!a.itineraries || !a.itineraries[0] || !a.itineraries[0].duration) return 0;
        if (!b.itineraries || !b.itineraries[0] || !b.itineraries[0].duration) return 0;
        const durationA = parseDurationToMinutes(a.itineraries[0].duration);
        const durationB = parseDurationToMinutes(b.itineraries[0].duration);
        return durationA - durationB;
      });

    case 'departure':
      return sorted.sort((a, b) => {
        if (!a.itineraries || !a.itineraries[0] || !a.itineraries[0].segments || !a.itineraries[0].segments[0]) return 0;
        if (!b.itineraries || !b.itineraries[0] || !b.itineraries[0].segments || !b.itineraries[0].segments[0]) return 0;
        const timeA = new Date(a.itineraries[0].segments[0].departure.at).getTime();
        const timeB = new Date(b.itineraries[0].segments[0].departure.at).getTime();
        return timeA - timeB;
      });

    default:
      return sorted;
  }
}

/**
 * Parse duration string to minutes
 */
function parseDurationToMinutes(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

/**
 * Get unique airlines from flight list
 */
export function getUniqueAirlines(flights: FlightOffer[]): string[] {
  const airlines = new Set<string>();
  flights.forEach((flight) => {
    flight.validatingAirlineCodes?.forEach((code) => airlines.add(code));
  });
  return Array.from(airlines).sort();
}

/**
 * Get price range from flight list
 */
export function getPriceRange(flights: FlightOffer[]): [number, number] {
  if (flights.length === 0) {
    return [0, 10000];
  }

  const prices = flights.map((flight) => parsePrice(flight.price.total));
  return [Math.min(...prices), Math.max(...prices)];
}

