
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CurrencyCode, getActiveCurrency } from '@/services/currencyService';

interface CurrencyContextType {
  activeCurrency: CurrencyCode;
  setActiveCurrency: (currency: CurrencyCode) => Promise<void>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  activeCurrency: 'BRL',
  setActiveCurrency: async () => {},
  isLoading: true
});

export const useCurrency = () => useContext(CurrencyContext);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const { user } = useAuth();
  const [activeCurrency, setActiveCurrencyState] = useState<CurrencyCode>('BRL');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's currency preference from profile
  useEffect(() => {
    const fetchCurrencyPreference = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('currency_preference')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const currency = getActiveCurrency(data?.currency_preference);
        setActiveCurrencyState(currency);
      } catch (error) {
        console.error('Error fetching currency preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencyPreference();
  }, [user]);

  // Update currency preference in database and state
  const setActiveCurrency = async (currency: CurrencyCode) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          currency_preference: currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setActiveCurrencyState(currency);
    } catch (error) {
      console.error('Error updating currency preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CurrencyContext.Provider value={{ activeCurrency, setActiveCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};
