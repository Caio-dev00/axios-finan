
// Define supported currencies and their conversion rates against BRL (Brazilian Real as base)
const conversionRates: Record<string, number> = {
  BRL: 1,
  USD: 0.18, // 1 BRL = 0.18 USD (approximate)
  EUR: 0.17, // 1 BRL = 0.17 EUR (approximate)
};

export type CurrencyCode = 'BRL' | 'USD' | 'EUR';

export interface CurrencyFormat {
  code: CurrencyCode;
  symbol: string;
  decimalSeparator: string;
  thousandsSeparator: string;
  decimalPlaces: number;
}

export const currencyFormats: Record<CurrencyCode, CurrencyFormat> = {
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimalPlaces: 2
  },
  USD: {
    code: 'USD',
    symbol: '$',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimalPlaces: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimalPlaces: 2
  }
};

/**
 * Convert an amount from one currency to another
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: CurrencyCode = 'BRL',
  toCurrency: CurrencyCode = 'BRL'
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to BRL first if not already in BRL
  const amountInBRL = fromCurrency === 'BRL' 
    ? amount 
    : amount / conversionRates[fromCurrency];
  
  // Then convert from BRL to target currency
  return amountInBRL * conversionRates[toCurrency];
};

/**
 * Format a number as currency string
 */
export const formatCurrency = (
  amount: number,
  currencyCode: CurrencyCode = 'BRL'
): string => {
  const format = currencyFormats[currencyCode];
  
  const formattedNumber = amount.toFixed(format.decimalPlaces)
    .replace('.', format.decimalSeparator)
    .replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandsSeparator);
  
  return `${format.symbol} ${formattedNumber}`;
};

/**
 * Get active currency from user preference or default to BRL
 */
export const getActiveCurrency = (currencyPreference?: string | null): CurrencyCode => {
  if (currencyPreference && currencyPreference in currencyFormats) {
    return currencyPreference as CurrencyCode;
  }
  return 'BRL'; // Default currency
};
