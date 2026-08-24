let cachedRates: Record<string, number> | null = null;

export const fetchRates = async (): Promise<Record<string, number>> => {
  if (cachedRates) return cachedRates;

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/EUR');
    
    if (!response.ok) throw new Error('API response failed');
    
    const data = await response.json();
    cachedRates = data.rates;
    return cachedRates;
    
  } catch (error) {
    console.error('Failed to fetch exchange rates, using fallbacks:', error);
    return { EUR: 1, USD: 1.10, GBP: 0.85, INR: 111.68 }; 
  }
};