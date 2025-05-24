
import React from 'react';
import { TaxHarvestingProvider } from '../context/TaxHarvestingContext';
import Header from '../components/Header';
import ImportantNotesDisclaimer from '../components/ImportantNotesDisclaimer';
import CapitalGainsCards from '../components/CapitalGainsCards';
import HoldingsTable from '../components/HoldingsTable';

const Index = () => {
  return (
    <TaxHarvestingProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tax Harvesting</h1>
            <div className="flex items-center space-x-2">
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm">
                How it works?
              </button>
            </div>
          </div>

          <ImportantNotesDisclaimer />
          <CapitalGainsCards />
          <HoldingsTable />
        </div>
      </div>
    </TaxHarvestingProvider>
  );
};

export default Index;
