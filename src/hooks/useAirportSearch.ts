import { useState, useEffect } from 'react';
import { amadeusService } from '../services/amadeus';
import type { Airport } from '../types';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for airport search with debouncing
 */
export function useAirportSearch() {
  const [query, setQuery] = useState('');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Don't search if we have a selected airport (to prevent re-opening dropdown)
    if (selectedAirport) {
      return;
    }

    if (!debouncedQuery || debouncedQuery.length < 2) {
      setAirports([]);
      return;
    }

    const searchAirports = async () => {
      setLoading(true);
      try {
        const results = await amadeusService.searchAirports(debouncedQuery);
        setAirports(results);
      } catch (error) {
        console.error('Error searching airports:', error);
        setAirports([]);
      } finally {
        setLoading(false);
      }
    };

    searchAirports();
  }, [debouncedQuery, selectedAirport]);

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    setQuery(`${airport.iataCode} - ${airport.name}`);
    setAirports([]);
    // Clear any pending debounced searches by resetting query state
  };

  const handleClear = () => {
    setQuery('');
    setSelectedAirport(null);
    setAirports([]);
  };

  return {
    query,
    setQuery,
    airports,
    loading,
    selectedAirport,
    handleSelect,
    handleClear,
  };
}

