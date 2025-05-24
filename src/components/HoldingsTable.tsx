
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useTaxHarvesting } from '../context/TaxHarvestingContext';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatNumber = (num: number) => {
  if (num < 0.0001 && num > 0) {
    return num.toExponential(4);
  }
  return num.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 6 
  });
};

const HoldingsTable = () => {
  const { state, dispatch } = useTaxHarvesting();
  const { holdings, selectedHoldings, loading } = state;
  const [showAll, setShowAll] = useState(false);
  const selectAllCheckboxRef = useRef<HTMLButtonElement>(null);

  const displayedHoldings = showAll ? holdings : holdings.slice(0, 6);
  const allSelected = selectedHoldings.size === holdings.length;
  const someSelected = selectedHoldings.size > 0 && selectedHoldings.size < holdings.length;

  // Handle indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const checkboxElement = selectAllCheckboxRef.current.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkboxElement) {
        checkboxElement.indeterminate = someSelected;
      }
    }
  }, [someSelected]);

  const handleSelectAll = () => {
    dispatch({ type: 'TOGGLE_ALL_HOLDINGS' });
  };

  const handleSelectHolding = (coin: string) => {
    dispatch({ type: 'TOGGLE_HOLDING', payload: coin });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Holdings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  <Checkbox
                    ref={selectAllCheckboxRef}
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    className="mr-2"
                  />
                  Asset
                </th>
                <th className="text-left py-4 px-4 font-medium text-gray-600">
                  Holdings<br/>
                  <span className="text-xs text-gray-400">Current Market Rate</span>
                </th>
                <th className="text-left py-4 px-4 font-medium text-gray-600">Total Current Value</th>
                <th className="text-left py-4 px-4 font-medium text-gray-600">Short-term</th>
                <th className="text-left py-4 px-4 font-medium text-gray-600">Long-Term</th>
                <th className="text-left py-4 px-4 font-medium text-gray-600">Amount to Sell</th>
              </tr>
            </thead>
            <tbody>
              {displayedHoldings.map((holding) => {
                const isSelected = selectedHoldings.has(holding.coin);
                const totalValue = holding.totalHolding * holding.currentPrice;
                
                return (
                  <tr 
                    key={holding.coin} 
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleSelectHolding(holding.coin)}
                        />
                        <img 
                          src={holding.logo} 
                          alt={holding.coin}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{holding.coin}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {holding.coinName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{formatNumber(holding.totalHolding)} {holding.coin}</div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(holding.averageBuyPrice)}/{holding.coin}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{formatCurrency(totalValue)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`font-medium ${holding.stcg.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.stcg.gain >= 0 ? '+' : ''}{formatCurrency(holding.stcg.gain)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatNumber(holding.stcg.balance)} {holding.coin}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`font-medium ${holding.ltcg.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.ltcg.gain >= 0 ? '+' : ''}{formatCurrency(holding.ltcg.gain)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatNumber(holding.ltcg.balance)} {holding.coin}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {isSelected ? (
                        <div className="font-medium text-blue-600">
                          {formatNumber(holding.totalHolding)} {holding.coin}
                        </div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {holdings.length > 6 && (
          <div className="p-6 border-t bg-gray-50">
            <Button
              variant="link"
              className="text-blue-600 p-0 h-auto font-normal"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'View Less' : 'View all'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HoldingsTable;
