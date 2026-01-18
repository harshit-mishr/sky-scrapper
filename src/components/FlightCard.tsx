import React from 'react';
import type { FlightCardProps } from '../types';
import {
  formatTime,
  formatDuration,
  getStopsCount,
  parsePrice,
  getAirlineName,
} from '../utils/flightUtils';
import { useCurrency } from '../contexts/CurrencyContext';
import { convertCurrency, formatCurrency } from '../utils/currencyUtils';

interface FlightCardPropsWithIndex extends FlightCardProps {
  index?: number;
  isCheapest?: boolean;
  isFastest?: boolean;
}

export function FlightCard({ flight, index = 0, isCheapest = false, isFastest = false }: FlightCardPropsWithIndex) {
  const { currency } = useCurrency();
  const itinerary = flight.itineraries[0];
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  const stops = getStopsCount(flight);
  
  // Convert price to selected currency
  const originalPrice = parsePrice(flight.price.total);
  const originalCurrency = (flight.price.currency || 'USD') as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR';
  const convertedPrice = convertCurrency(originalPrice, originalCurrency, currency);

  const getStopsLabel = () => {
    if (stops === 0) return 'Non-stop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 relative group">
      {/* Best Deal Badges */}
      {isCheapest && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">
          💰 Best Price
        </div>
      )}
      {isFastest && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          ⚡ Fastest
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Flight Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {flight.validatingAirlineCodes && flight.validatingAirlineCodes.length > 0
                ? getAirlineName(flight.validatingAirlineCodes[0])
                : 'Multiple Airlines'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{getStopsLabel()}</span>
            {stops === 0 && (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-500">•</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Direct</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Departure */}
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(firstSegment.departure.at)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{firstSegment.departure.iataCode}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(firstSegment.departure.at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="flex-1 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{formatDuration(itinerary.duration)}</div>
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <div className="mx-2 text-gray-400 dark:text-gray-500">✈</div>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex-1 text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(lastSegment.arrival.at)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{lastSegment.arrival.iataCode}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(lastSegment.arrival.at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Additional segments for multi-stop flights */}
          {stops > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600">
                {itinerary.segments.length} segment{itinerary.segments.length > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col items-end justify-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
            {formatCurrency(convertedPrice, currency)}
          </div>
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all transform hover:scale-105 text-sm font-medium shadow-md hover:shadow-lg">
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
}

