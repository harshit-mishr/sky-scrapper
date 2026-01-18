import React, { useMemo } from 'react';
import { useFlightStore } from '../store/flightStore';
import { FlightCard } from './FlightCard';
import { FlightCardSkeleton } from './SkeletonLoader';
import { EmptyState } from './EmptyState';
import { parsePrice } from '../utils/flightUtils';
import { useCurrency } from '../contexts/CurrencyContext';
import { convertCurrency } from '../utils/currencyUtils';

export function FlightResults() {
  const { filteredFlights, loading, error, flights, sortBy } = useFlightStore();
  const { currency } = useCurrency();

  // Find cheapest and fastest flights (convert prices to selected currency for comparison)
  const { cheapestPrice, fastestDuration } = useMemo(() => {
    if (filteredFlights.length === 0) return { cheapestPrice: Infinity, fastestDuration: Infinity };
    
    const prices = filteredFlights.map(f => {
      const originalPrice = parsePrice(f.price.total);
      const originalCurrency = (f.price.currency || 'USD') as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR';
      return convertCurrency(originalPrice, originalCurrency, currency);
    });
    const durations = filteredFlights.map(f => {
      const match = f.itineraries[0].duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      if (!match) return Infinity;
      const hours = parseInt(match[1] || '0', 10);
      const minutes = parseInt(match[2] || '0', 10);
      return hours * 60 + minutes;
    });

    return {
      cheapestPrice: Math.min(...prices),
      fastestDuration: Math.min(...durations),
    };
  }, [filteredFlights, currency]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <FlightCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        message={error}
      />
    );
  }

  if (flights.length === 0) {
    return (
      <EmptyState
        type="no-search"
      />
    );
  }

  if (filteredFlights.length === 0) {
    const { resetFilters } = useFlightStore.getState();
    return (
      <EmptyState
        type="no-results"
        message="No flights match your current filters. Try unchecking some filters or adjusting your search criteria."
        action={{
          label: 'Clear All Filters',
          onClick: resetFilters,
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
        </h2>
      </div>
      {filteredFlights.map((flight, index) => {
        // Convert price to selected currency for comparison
        const originalPrice = parsePrice(flight.price.total);
        const originalCurrency = (flight.price.currency || 'USD') as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR';
        const convertedPrice = convertCurrency(originalPrice, originalCurrency, currency);
        
        const durationMatch = flight.itineraries[0].duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        const durationMinutes = durationMatch
          ? parseInt(durationMatch[1] || '0', 10) * 60 + parseInt(durationMatch[2] || '0', 10)
          : Infinity;

        return (
          <FlightCard
            key={flight.id}
            flight={flight}
            index={index}
            isCheapest={convertedPrice === cheapestPrice && sortBy === 'price'}
            isFastest={durationMinutes === fastestDuration && sortBy === 'duration'}
          />
        );
      })}
    </div>
  );
}

