import Decimal from 'decimal.js';

const formatString = (value: string) => {
  if (value === '' || value === null) {
    return '';
  }
  return value.slice(0, value.indexOf('-')).trim();
};

const fetchCurrencyConversionRate = async (
  fromCurrency: string,
  toCurrency: string,
) => {
  const formattedFrom = formatString(fromCurrency);
  const currencyApiKey = process.env.REACT_APP_CURRENCY_API_KEY;
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${currencyApiKey}/latest/${formattedFrom}`,
    );
    const data = await response.json();
    const rate = data.conversion_rates[formatString(toCurrency)];
    saveCache(fromCurrency, data);
    const lastUpdated = data.time_last_update_utc;

    return { rate: rate, lastUpdated: lastUpdated };
  } catch (error) {
    throw error;
  }
};

const saveCache = (fromCurrency: string, data: any) => {
  const cacheObj = {
    time_last_update_utc: data.time_last_update_utc,
    base_code: data.base_code,
    conversion_rates: data.conversion_rates,
  };
  localStorage.setItem(fromCurrency, JSON.stringify(cacheObj));
};

const fetchCurrencyCodes = async () => {
  const currencyApiKey = process.env.REACT_APP_CURRENCY_API_KEY;
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${currencyApiKey}/codes`,
    );
    const data = await response.json();
    const options: string[] = data['supported_codes'].map(
      (code: string[]) => `${code[0]} - ${code[1]}`,
    );
    return options;
  } catch (error) {
    throw error;
  }
};

const formatValue = (value: string, fromCurrency: string) => {
  if (value !== '') {
    const formattedCurrencyValue = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formatString(fromCurrency),
    })
      .format(Number(value))
      .trim();
    return formattedCurrencyValue;
  }
  return '';
};

const convertAmount = (amountInput: string, rate: number) => {
  const amount = new Decimal(amountInput);
  const conversionRate = new Decimal(rate);

  return amount.times(conversionRate).toString();
};

export {
  formatString,
  fetchCurrencyConversionRate,
  fetchCurrencyCodes,
  formatValue,
  convertAmount,
};
