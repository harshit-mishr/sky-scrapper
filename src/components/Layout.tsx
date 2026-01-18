import React, { useState } from 'react';
import { FlightSearch } from './FlightSearch';
import { FlightFilters } from './FlightFilters';
import { FlightResults } from './FlightResults';
import { PriceGraph } from './PriceGraph';
import { ThemeToggle } from './ThemeToggle';
import { CurrencyToggle } from './CurrencyToggle';
import { useFlightStore } from '../store/flightStore';
import { useDarkMode } from '../hooks/useDarkMode';
import { useCurrency } from '../contexts/CurrencyContext';

export function Layout() {
  const { filteredFlights, flights, loading } = useFlightStore();
  const { isDark } = useDarkMode();
  const { currency, setCurrency } = useCurrency();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sky Scrapper</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find the best flight deals</p>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyToggle currentCurrency={currency} onCurrencyChange={setCurrency} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <FlightSearch />

        {/* Results Section - Show when flights exist (even if filtered results are empty) */}
        {flights.length > 0 && (
          <>
            {/* Mobile Filter Button */}
            {isMobile && (
              <div className="mb-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>🔍</span>
                  <span className="font-medium">Filters & Sort</span>
                </button>
              </div>
            )}

            {/* Price Graph - Only show if there are filtered results */}
            {filteredFlights.length > 0 && (
              <div className="mb-6">
                <PriceGraph flights={filteredFlights} />
              </div>
            )}

            {/* Desktop Layout */}
            {!isMobile ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar - Always visible when flights exist */}
                <div className="lg:col-span-1">
                  <FlightFilters />
                </div>

                {/* Results - Shows empty state if no filtered flights */}
                <div className="lg:col-span-3">
                  <FlightResults />
                </div>
              </div>
            ) : (
              /* Mobile Layout */
              <div>
                <FlightResults />
                {showMobileFilters && (
                  <FlightFilters
                    isMobile={true}
                    onClose={() => setShowMobileFilters(false)}
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Initial State - handled by FlightResults EmptyState */}
      </main>
    </div>
  );
}

