import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
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
        <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pre Harvesting Card */}
        <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Pre Harvesting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium"></div>
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Short-term</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Long-term</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Profits</div>
              <div className="text-center font-semibold">{formatCurrency(originalCapitalGains.stcg.profits)}</div>
              <div className="text-center font-semibold">{formatCurrency(originalCapitalGains.ltcg.profits)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Losses</div>
              <div className="text-center font-semibold">- {formatCurrency(originalCapitalGains.stcg.losses)}</div>
              <div className="text-center font-semibold">- {formatCurrency(originalCapitalGains.ltcg.losses)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Net Capital Gains</div>
              <div className="text-center font-semibold">{formatCurrency(originalNetSTCG)}</div>
              <div className="text-center font-semibold">{formatCurrency(originalNetLTCG)}</div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
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
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-blue-100 text-sm font-medium"></div>
              <div className="text-blue-100 text-sm font-medium">Short-term</div>
              <div className="text-blue-100 text-sm font-medium">Long-term</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-blue-100 text-sm font-medium">Profits</div>
              <div className="text-center font-semibold">{formatCurrency(currentCapitalGains.stcg.profits)}</div>
              <div className="text-center font-semibold">{formatCurrency(currentCapitalGains.ltcg.profits)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-blue-100 text-sm font-medium">Losses</div>
              <div className="text-center font-semibold">- {formatCurrency(currentCapitalGains.stcg.losses)}</div>
              <div className="text-center font-semibold">- {formatCurrency(currentCapitalGains.ltcg.losses)}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-blue-100 text-sm font-medium">Net Capital Gains</div>
              <div className="text-center font-semibold">- {formatCurrency(Math.abs(currentNetSTCG))}</div>
              <div className="text-center font-semibold">- {formatCurrency(Math.abs(currentNetLTCG))}</div>
            </div>
            
            <div className="pt-4 border-t border-blue-400">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold">Effective Capital Gains:</span>
                <span className="text-xl font-bold">- {formatCurrency(Math.abs(currentRealisedGains))}</span>
              </div>
              
              {showSavings && (
                <div className="flex items-center justify-between bg-blue-600/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🎉</span>
                    <span className="font-medium">You are going to save upto {formatCurrency(savings)}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Tax savings are calculated by comparing your original capital gains tax liability 
                          with the reduced liability after harvesting losses. The savings represent the 
                          difference between what you would have paid before and after implementing the 
                          tax harvesting strategy.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default CapitalGainsCards;
