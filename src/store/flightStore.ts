import { create } from 'zustand';
import type { FlightOffer, FlightSearchParams, Filters, SortOption, FlightState } from '../types';
import { filterFlights, sortFlights, getPriceRange, getUniqueAirlines } from '../utils/flightUtils';

interface FlightStore extends FlightState {
  // Actions
  setFlights: (flights: FlightOffer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchParams: (params: FlightSearchParams | null) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setSortBy: (sortBy: SortOption) => void;
  resetFilters: () => void;
  applyFiltersAndSort: () => void;
}

const defaultFilters: Filters = {
  stops: [],
  priceRange: [0, 10000],
  airlines: [],
};

export const useFlightStore = create<FlightStore>((set, get) => ({
  // Initial state
  flights: [],
  filteredFlights: [],
  loading: false,
  error: null,
  searchParams: null,
  filters: defaultFilters,
  sortBy: 'price',

  // Actions
  setFlights: (flights) => {
    const priceRange = getPriceRange(flights);
    set({
      flights,
      filters: {
        ...get().filters,
        priceRange,
      },
    });
    get().applyFiltersAndSort();
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSearchParams: (params) => set({ searchParams: params }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));
    get().applyFiltersAndSort();
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().applyFiltersAndSort();
  },

  resetFilters: () => {
    const priceRange = getPriceRange(get().flights);
    set({
      filters: {
        ...defaultFilters,
        priceRange,
      },
    });
    get().applyFiltersAndSort();
  },

  applyFiltersAndSort: () => {
    try {
      const { flights, filters, sortBy } = get();
      
      // Validate inputs
      if (!flights || !Array.isArray(flights)) {
        set({ filteredFlights: [] });
        return;
      }

      if (!filters || typeof filters !== 'object') {
        set({ filteredFlights: flights });
        return;
      }
      
      // Apply filters
      let filtered = filterFlights(flights, filters);
      
      // Apply sorting
      filtered = sortFlights(filtered, sortBy);
      
      set({ filteredFlights: filtered });
    } catch (error) {
      console.error('Error applying filters and sort:', error);
      // Fallback to showing all flights if filtering fails
      set({ filteredFlights: get().flights });
    }
  },
}));

