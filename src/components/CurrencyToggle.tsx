import React, { useState } from 'react';
import type { Currency } from '../utils/currencyUtils';
import { formatCurrency } from '../utils/currencyUtils';

interface CurrencyToggleProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'];

export function CurrencyToggle({ currentCurrency, onCurrencyChange }: CurrencyToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <span>{currentCurrency}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 min-w-[120px]">
            {currencies.map((currency) => (
              <button
                key={currency}
                onClick={() => {
                  onCurrencyChange(currency);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentCurrency === currency
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {currency}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

