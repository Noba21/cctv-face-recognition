import React from 'react';
import AppRoutes from './routes/AppRoutes'; // Make sure this import is correct
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-secondary-900">
        <AppRoutes />
      </div>
    </HelmetProvider>
  );
}

export default App;