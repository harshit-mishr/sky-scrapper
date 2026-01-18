import { useState, useEffect } from 'react';
import type { FlightSearchParams } from '../types';

const STORAGE_KEY = 'sky_scrapper_recent_searches';
const MAX_RECENT_SEARCHES = 5;

interface RecentSearch extends FlightSearchParams {
  id: string;
  timestamp: number;
  originName?: string;
  destinationName?: string;
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  const saveSearch = (search: FlightSearchParams, originName?: string, destinationName?: string) => {
    try {
      const newSearch: RecentSearch = {
        ...search,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        originName,
        destinationName,
      };

      setRecentSearches((prev) => {
        // Remove duplicates (same origin/destination)
        const filtered = prev.filter(
          (s) =>
            !(
              s.originLocationCode === newSearch.originLocationCode &&
              s.destinationLocationCode === newSearch.destinationLocationCode
            )
        );

        // Add new search at the beginning
        const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  return {
    recentSearches,
    saveSearch,
    clearRecentSearches,
  };
}

