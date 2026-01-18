import React from 'react';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Layout } from './components/Layout';
import './App.css';

function App() {
  return (
    <CurrencyProvider>
      <Layout />
    </CurrencyProvider>
  );
}

export default App;

