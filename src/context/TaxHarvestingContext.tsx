
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Holding, CapitalGains } from '../types';
import { fetchHoldings, fetchCapitalGains } from '../services/api';

interface TaxHarvestingState {
  holdings: Holding[];
  selectedHoldings: Set<string>;
  originalCapitalGains: CapitalGains | null;
  currentCapitalGains: CapitalGains | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGains }
  | { type: 'TOGGLE_HOLDING'; payload: string }
  | { type: 'TOGGLE_ALL_HOLDINGS' }
  | { type: 'UPDATE_CURRENT_CAPITAL_GAINS'; payload: CapitalGains };

const initialState: TaxHarvestingState = {
  holdings: [],
  selectedHoldings: new Set(),
  originalCapitalGains: null,
  currentCapitalGains: null,
  loading: true,
  error: null,
};

const TaxHarvestingContext = createContext<{
  state: TaxHarvestingState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function taxHarvestingReducer(state: TaxHarvestingState, action: Action): TaxHarvestingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_HOLDINGS':
      return { ...state, holdings: action.payload };
    case 'SET_CAPITAL_GAINS':
      return { 
        ...state, 
        originalCapitalGains: action.payload,
        currentCapitalGains: action.payload,
        loading: false 
      };
    case 'TOGGLE_HOLDING':
      const newSelected = new Set(state.selectedHoldings);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selectedHoldings: newSelected };
    case 'TOGGLE_ALL_HOLDINGS':
      const allSelected = state.selectedHoldings.size === state.holdings.length;
      return {
        ...state,
        selectedHoldings: allSelected ? new Set() : new Set(state.holdings.map(h => h.coin))
      };
    case 'UPDATE_CURRENT_CAPITAL_GAINS':
      return { ...state, currentCapitalGains: action.payload };
    default:
      return state;
  }
}

export const TaxHarvestingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taxHarvestingReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const [holdingsData, capitalGainsData] = await Promise.all([
          fetchHoldings(),
          fetchCapitalGains()
        ]);
        
        dispatch({ type: 'SET_HOLDINGS', payload: holdingsData });
        dispatch({ type: 'SET_CAPITAL_GAINS', payload: capitalGainsData.capitalGains });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      }
    };

    loadData();
  }, []);

  // Update capital gains when selections change
  useEffect(() => {
    if (!state.originalCapitalGains || !state.holdings.length) return;

    const selectedHoldingsData = state.holdings.filter(h => state.selectedHoldings.has(h.coin));
    
    const updatedGains = { ...state.originalCapitalGains };
    
    selectedHoldingsData.forEach(holding => {
      // Add STCG gains/losses
      if (holding.stcg.gain > 0) {
        updatedGains.stcg.profits += holding.stcg.gain;
      } else {
        updatedGains.stcg.losses += Math.abs(holding.stcg.gain);
      }
      
      // Add LTCG gains/losses
      if (holding.ltcg.gain > 0) {
        updatedGains.ltcg.profits += holding.ltcg.gain;
      } else {
        updatedGains.ltcg.losses += Math.abs(holding.ltcg.gain);
      }
    });

    dispatch({ type: 'UPDATE_CURRENT_CAPITAL_GAINS', payload: updatedGains });
  }, [state.selectedHoldings, state.originalCapitalGains, state.holdings]);

  return (
    <TaxHarvestingContext.Provider value={{ state, dispatch }}>
      {children}
    </TaxHarvestingContext.Provider>
  );
};

export const useTaxHarvesting = () => {
  const context = useContext(TaxHarvestingContext);
  if (!context) {
    throw new Error('useTaxHarvesting must be used within a TaxHarvestingProvider');
  }
  return context;
};
