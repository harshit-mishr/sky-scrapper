import React, { useState, useEffect } from 'react';
import { useFlightStore } from '../store/flightStore';
import { getUniqueAirlines, getPriceRange, parsePrice, getAirlineName } from '../utils/flightUtils';
import { useCurrency } from '../contexts/CurrencyContext';
import { convertCurrency, formatCurrency } from '../utils/currencyUtils';
import type { SortOption } from '../types';

interface FlightFiltersProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function FlightFilters({ isMobile = false, onClose }: FlightFiltersProps) {
  const { flights, filters, sortBy, setFilters, setSortBy, resetFilters } = useFlightStore();
  const { currency } = useCurrency();
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 10000]);

  const uniqueAirlines = getUniqueAirlines(flights);
  // Prices are stored in USD, convert for display
  const priceRangeUSD = getPriceRange(flights);
  const maxPriceUSD = priceRangeUSD[1];
  const minPriceUSD = priceRangeUSD[0];
  
  // Convert to display currency
  const maxPrice = convertCurrency(maxPriceUSD, 'USD', currency);
  const minPrice = convertCurrency(minPriceUSD, 'USD', currency);
  
  // Convert current filter range from USD to display currency for UI
  const displayPriceRange: [number, number] = [
    convertCurrency(filters.priceRange[0], 'USD', currency),
    convertCurrency(filters.priceRange[1], 'USD', currency),
  ];

  useEffect(() => {
    // Convert filter range from USD to display currency
    setLocalPriceRange([
      convertCurrency(filters.priceRange[0], 'USD', currency),
      convertCurrency(filters.priceRange[1], 'USD', currency),
    ]);
  }, [filters.priceRange, currency]);

  const handleStopToggle = (stopCount: number) => {
    const newStops = filters.stops.includes(stopCount)
      ? filters.stops.filter((s) => s !== stopCount)
      : [...filters.stops, stopCount];
    setFilters({ stops: newStops });
  };

  const handlePriceRangeChange = (value: number, index: 0 | 1) => {
    const newRange: [number, number] = [...localPriceRange];
    newRange[index] = value;
    setLocalPriceRange(newRange);
  };

  const handlePriceRangeCommit = () => {
    // Convert back to USD for filtering (since API returns USD)
    const usdRange: [number, number] = [
      convertCurrency(localPriceRange[0], currency, 'USD'),
      convertCurrency(localPriceRange[1], currency, 'USD'),
    ];
    setFilters({ priceRange: usdRange });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    setFilters({ airlines: newAirlines });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  const hasActiveFilters =
    filters.stops.length > 0 ||
    filters.airlines.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  const content = (
    <div className="space-y-6">
      {/* Sort Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Sort by</h3>
        <div className="space-y-2">
          {(['price', 'duration', 'departure'] as SortOption[]).map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="radio"
                name="sort"
                value={option}
                checked={sortBy === option}
                onChange={() => handleSortChange(option)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm text-gray-700 capitalize">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stops Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Stops</h3>
        <div className="space-y-2">
          {[
            { value: 0, label: 'Non-stop' },
            { value: 1, label: '1 stop' },
            { value: 2, label: '2+ stops' },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={filters.stops.includes(value)}
                onChange={() => handleStopToggle(value)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Min</label>
              <input
                type="number"
                value={localPriceRange[0]}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 0, 0)}
                onBlur={handlePriceRangeCommit}
                min={0}
                max={maxPrice}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={localPriceRange[1]}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || maxPrice, 1)}
                onBlur={handlePriceRangeCommit}
                min={0}
                max={maxPrice}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Range: {formatCurrency(localPriceRange[0], currency)} - {formatCurrency(localPriceRange[1], currency)}
          </div>
        </div>
      </div>

      {/* Airlines Filter */}
      {uniqueAirlines.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Airlines</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uniqueAirlines.map((airline) => (
              <label
                key={airline}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  {getAirlineName(airline)} ({airline})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Reset Filters */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
      {content}
    </div>
  );
}

