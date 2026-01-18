import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useFlightStore } from '../store/flightStore';
import { amadeusService } from '../services/amadeus';
import { useAirportSearch } from '../hooks/useAirportSearch';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { format } from 'date-fns';

export function FlightSearch() {
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [adults, setAdults] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const { setFlights, setLoading, setError, setSearchParams } = useFlightStore();
  const { recentSearches, saveSearch } = useRecentSearches();
  
  const originSearch = useAirportSearch();
  const destinationSearch = useAirportSearch();
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  // Set default date to tomorrow
  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDepartureDate(format(tomorrow, 'yyyy-MM-dd'));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!originSearch.selectedAirport || !destinationSearch.selectedAirport) {
      setError('Please select origin and destination airports');
      return;
    }

    if (!departureDate) {
      setError('Please select a departure date');
      return;
    }

    if (isRoundTrip && !returnDate) {
      setError('Please select a return date for round trip');
      return;
    }

    setIsSearching(true);
    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        originLocationCode: originSearch.selectedAirport.iataCode,
        destinationLocationCode: destinationSearch.selectedAirport.iataCode,
        departureDate,
        returnDate: isRoundTrip ? returnDate : undefined,
        adults,
      };

      setSearchParams(searchParams);
      const response = await amadeusService.searchFlights(searchParams);
      setFlights(response.data);
      
      // Save to recent searches
      saveSearch(
        searchParams,
        originSearch.selectedAirport.name,
        destinationSearch.selectedAirport.name
      );
    } catch (error: any) {
      setError(error.message || 'Failed to search flights');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleRecentSearchClick = (search: any) => {
    originSearch.setQuery(`${search.originLocationCode} - ${search.originName || ''}`);
    destinationSearch.setQuery(`${search.destinationLocationCode} - ${search.destinationName || ''}`);
    setDepartureDate(search.departureDate);
    if (search.returnDate) {
      setReturnDate(search.returnDate);
      setIsRoundTrip(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Recent Searches:</div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 3).map((search) => (
              <button
                key={search.id}
                type="button"
                onClick={() => handleRecentSearchClick(search)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {search.originLocationCode} → {search.destinationLocationCode}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="roundTrip"
            checked={isRoundTrip}
            onChange={(e) => setIsRoundTrip(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label htmlFor="roundTrip" className="text-sm font-medium text-gray-700">
            Round trip
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin */}
          <div className="relative" ref={originRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                value={originSearch.query}
                onChange={(e) => {
                  originSearch.setQuery(e.target.value);
                  // Clear selection if user starts typing
                  if (originSearch.selectedAirport) {
                    originSearch.handleClear();
                  }
                }}
                onFocus={() => {
                  // Clear selection on focus to allow new search
                  if (originSearch.selectedAirport && originSearch.query === `${originSearch.selectedAirport.iataCode} - ${originSearch.selectedAirport.name}`) {
                    originSearch.setQuery(originSearch.selectedAirport.iataCode);
                    originSearch.handleClear();
                  }
                }}
                placeholder="City or airport code"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {originSearch.airports.length > 0 && !originSearch.selectedAirport && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {originSearch.airports.map((airport) => (
                    <button
                      key={airport.iataCode}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        originSearch.handleSelect(airport);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{airport.iataCode}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{airport.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Destination */}
          <div className="relative" ref={destinationRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                value={destinationSearch.query}
                onChange={(e) => destinationSearch.setQuery(e.target.value)}
                placeholder="City or airport code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {destinationSearch.airports.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {destinationSearch.airports.map((airport) => (
                    <button
                      key={airport.iataCode}
                      type="button"
                      onClick={() => destinationSearch.handleSelect(airport)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      <div className="font-medium">{airport.iataCode}</div>
                      <div className="text-sm text-gray-600">{airport.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Return Date */}
          {isRoundTrip && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Passengers */}
          {!isRoundTrip && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <input
                type="number"
                value={adults}
                onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={9}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
}

