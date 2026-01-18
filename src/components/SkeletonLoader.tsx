import React from 'react';

export function FlightCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 space-y-4">
          {/* Airline and stops */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-2 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Flight times */}
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="flex-1 text-center space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-200"></div>
                <div className="mx-2 h-4 w-4 bg-gray-200 rounded"></div>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            </div>
            <div className="flex-1 text-right space-y-2">
              <div className="h-8 w-20 bg-gray-200 rounded ml-auto"></div>
              <div className="h-4 w-12 bg-gray-200 rounded ml-auto"></div>
              <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end space-y-2">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse space-y-6">
      <div className="h-6 w-24 bg-gray-200 rounded"></div>
      <div className="space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-full bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

