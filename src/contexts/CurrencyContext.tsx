import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Currency } from '../utils/currencyUtils';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    // Load from localStorage
    const stored = localStorage.getItem('preferredCurrency');
    if (stored && ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'INR'].includes(stored)) {
      return stored as Currency;
    }
    return 'USD';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

