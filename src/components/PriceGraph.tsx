import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PriceGraphProps } from '../types';
import { parsePrice } from '../utils/flightUtils';
import { useCurrency } from '../contexts/CurrencyContext';
import { convertCurrency, formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

export function PriceGraph({ flights }: PriceGraphProps) {
  const { currency } = useCurrency();
  
  // Transform flight data for the chart with currency conversion
  const chartData = useMemo(() => {
    return flights.map((flight, index) => {
      const originalPrice = parsePrice(flight.price.total);
      const originalCurrency = (flight.price.currency || 'USD') as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR';
      const convertedPrice = convertCurrency(originalPrice, originalCurrency, currency);
      
      return {
        index: index + 1,
        price: convertedPrice,
        label: `Flight ${index + 1}`,
        currency: currency,
      };
    });
  }, [flights, currency]);

  if (flights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-64 flex items-center justify-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400">No flight data to display</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{data.label}</p>
          <p className="text-primary-600 dark:text-primary-400">
            {formatCurrency(data.price, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Price Trends ({currency})</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="index"
            label={{ value: 'Flight Options', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis
            label={{ value: 'Price', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
            tickFormatter={(value) => `${currencySymbol}${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

