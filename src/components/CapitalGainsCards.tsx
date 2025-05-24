
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaxHarvesting } from '../context/TaxHarvestingContext';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CapitalGainsCards = () => {
  const { state } = useTaxHarvesting();
  const { originalCapitalGains, currentCapitalGains } = state;

  if (!originalCapitalGains || !currentCapitalGains) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="koinx-dark text-white animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-700 rounded"></div>
          </CardContent>
        </Card>
        <Card className="koinx-blue text-white animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-blue-700 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const originalNetSTCG = originalCapitalGains.stcg.profits - originalCapitalGains.stcg.losses;
  const originalNetLTCG = originalCapitalGains.ltcg.profits - originalCapitalGains.ltcg.losses;
  const originalRealisedGains = originalNetSTCG + originalNetLTCG;

  const currentNetSTCG = currentCapitalGains.stcg.profits - currentCapitalGains.stcg.losses;
  const currentNetLTCG = currentCapitalGains.ltcg.profits - currentCapitalGains.ltcg.losses;
  const currentRealisedGains = currentNetSTCG + currentNetLTCG;

  const savings = originalRealisedGains - currentRealisedGains;
  const showSavings = savings > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Pre Harvesting Card */}
      <Card className="koinx-dark text-white border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Pre Harvesting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-300 mb-1">Short-term</div>
            </div>
            <div className="text-center">
              <div className="text-gray-300 mb-1">Long-term</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-300 text-sm mb-1">Profits</div>
                <div className="font-semibold">{formatCurrency(originalCapitalGains.stcg.profits)}</div>
              </div>
              <div>
                <div className="font-semibold">{formatCurrency(originalCapitalGains.ltcg.profits)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-300 text-sm mb-1">Losses</div>
                <div className="font-semibold">- {formatCurrency(originalCapitalGains.stcg.losses)}</div>
              </div>
              <div>
                <div className="font-semibold">- {formatCurrency(originalCapitalGains.ltcg.losses)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-300 text-sm mb-1">Net Capital Gains</div>
                <div className="font-semibold">{formatCurrency(originalNetSTCG)}</div>
              </div>
              <div>
                <div className="font-semibold">{formatCurrency(originalNetLTCG)}</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Realised Capital Gains:</span>
              <span className="text-xl font-bold">{formatCurrency(originalRealisedGains)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* After Harvesting Card */}
      <Card className="koinx-blue text-white border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">After Harvesting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-blue-100 mb-1">Short-term</div>
            </div>
            <div className="text-center">
              <div className="text-blue-100 mb-1">Long-term</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-blue-100 text-sm mb-1">Profits</div>
                <div className="font-semibold">{formatCurrency(currentCapitalGains.stcg.profits)}</div>
              </div>
              <div>
                <div className="font-semibold">{formatCurrency(currentCapitalGains.ltcg.profits)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-blue-100 text-sm mb-1">Losses</div>
                <div className="font-semibold">- {formatCurrency(currentCapitalGains.stcg.losses)}</div>
              </div>
              <div>
                <div className="font-semibold">- {formatCurrency(currentCapitalGains.ltcg.losses)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-blue-100 text-sm mb-1">Net Capital Gains</div>
                <div className="font-semibold">- {formatCurrency(Math.abs(currentNetSTCG))}</div>
              </div>
              <div>
                <div className="font-semibold">- {formatCurrency(Math.abs(currentNetLTCG))}</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-400">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold">Effective Capital Gains:</span>
              <span className="text-xl font-bold">- {formatCurrency(Math.abs(currentRealisedGains))}</span>
            </div>
            
            {showSavings && (
              <div className="flex items-center space-x-2 bg-blue-600/30 rounded-lg p-3">
                <span className="text-lg">🎉</span>
                <span className="font-medium">You are going to save upto {formatCurrency(savings)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CapitalGainsCards;
