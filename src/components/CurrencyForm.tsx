import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  convertAmount,
  fetchCurrencyCodes,
  fetchCurrencyConversionRate,
  formatValue,
  formatString,
} from '../utils/helper';
import { HistoryTable } from './HistoryTable';
import { ConversionData } from '../interfaces';

const CurrencyForm = () => {
  const [fromCurrency, setFromCurrency] = useState(
    'USD - United States Dollar',
  );
  const [toCurrency, setToCurrency] = useState('INR - Indian Rupee');
  const [amountInput, setAmountInput] = useState('');
  const [displayReset, setDisplayReset] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [conversionResult, setConversionResult] = useState('');
  const [conversionRate, setConversionRate] = useState(0);
  const [isConvert, setIsConvert] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);
  const [previousConversions, setPreviousConversions] = useState<
    ConversionData[]
  >([]);
  const [displayError, setDisplayError] = useState(false);
  const [displayResult, setDisplayResult] = useState<ConversionData>();
  const [randomValue, setRandomValue] = useState<number>();
  const [rateLastUpdated, setRateLastUpdated] = useState('');

  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      const fetchCodes = async () => {
        try {
          const options = await fetchCurrencyCodes();
          setCurrencyOptions(options);
          setDisplayError(false);
          ref.current = false;
        } catch (error) {
          setDisplayError(true);
          setDisplayReset(true);
        }
      };

      fetchCodes();
    }
  }, []);

  useEffect(() => {
    if (isConvert) {
      // check local storage for previously cached data
      const cachedData = localStorage.getItem(fromCurrency);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cachedDay = new Date(
          parsedData['time_last_update_utc'],
        ).getDate();
        const cachedMonth = new Date(
          parsedData['time_last_update_utc'],
        ).getMonth();
        const cachedYear = new Date(
          parsedData['time_last_update_utc'],
        ).getFullYear();
        const cachedDate = `${cachedDay}${cachedMonth}${cachedYear}`;
        const presentDay = new Date().getDate();
        const presentMonth = new Date().getMonth();
        const presentYear = new Date().getFullYear();
        const presentDate = `${presentDay}${presentMonth}${presentYear}`;

        // check if api call is from present day
        // if not, make a new api call
        // else use cached data
        if (cachedDate === presentDate) {
          const rate = parsedData.conversion_rates[formatString(toCurrency)];
          const lastUpdateDate = new Date(
            parsedData['time_last_update_utc'],
          ).toUTCString();
          setConversionRate(rate);
          setRateLastUpdated(lastUpdateDate);
          const conversion = convertAmount(amountInput, rate);

          setConversionResult(conversion);
        } else {
          localStorage.removeItem(fromCurrency);
          getCurrencyConversion();
        }
      } else {
        getCurrencyConversion();
      }
    }
  }, [isConvert, randomValue]);

  useEffect(() => {
    if (conversionResult) {
      const history = {
        amountInput: formatValue(amountInput, fromCurrency),
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        convertedAmount: formatValue(conversionResult, fromCurrency),
      };
      setPreviousConversions([...previousConversions, history]);
      setDisplayResult({
        ...history,
        amountInput: amountInput,
        convertedAmount: conversionResult,
        conversionRate: conversionRate,
      });
    }
  }, [conversionResult]);

  const getCurrencyConversion = () => {
    fetchCurrencyConversionRate(fromCurrency, toCurrency)
      .then((res: { rate: number; lastUpdated: string }) => {
        const rate = res['rate'];
        const lastUpdateDate = new Date(res['lastUpdated']).toUTCString();
        setConversionRate(rate);
        setRateLastUpdated(lastUpdateDate);
        const conversion = convertAmount(amountInput, rate);
        setConversionResult(conversion);
        setDisplayError(false);
      })
      .catch((error) => {
        setDisplayError(true);
        setDisplayReset(true);
      });
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvertSubmit = () => {
    if (
      isNaN(Number(amountInput)) ||
      amountInput === '' ||
      Number(amountInput) < 0
    ) {
      setIsAmountValid(false);
      setDisplayReset(false);
      setIsConvert(false);
    } else {
      setIsConvert(true);
      setDisplayReset(true);
      setIsAmountValid(true);

      // to handle effect when user submits same inputs consecutively
      setRandomValue(Math.random());
    }
  };

  const handleReset = () => {
    setAmountInput('');
    setFromCurrency('USD - United States Dollar');
    setToCurrency('INR - Indian Rupee');
    setDisplayReset(false);
    setIsAmountValid(true);
    setConversionResult('');
    setConversionRate(0);
    setDisplayError(false);
  };

  return (
    <>
      <Typography
        align="center"
        variant="h4"
        sx={{
          margin: '8% auto auto auto',
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: '600',
        }}
      >
        Currency Converter
      </Typography>
      <Card sx={{ maxWidth: '80%', margin: '5% auto auto auto' }}>
        <CardActions>
          <TextField
            id="amount"
            label="Enter Amount"
            variant="outlined"
            value={amountInput}
            onChange={(event) => {
              setAmountInput(event.target.value);
              if (event.target.value) {
                if (isNaN(Number(event.target.value))) {
                  setIsAmountValid(false);
                  setDisplayReset(false);
                } else {
                  setIsAmountValid(true);
                }
              } else {
                setIsAmountValid(true);
              }
            }}
            error={!isAmountValid}
            helperText={isAmountValid ? '' : 'Please enter a valid number.'}
            sx={{
              width: 300,
              height: 50,
              margin: '4% auto auto auto',
            }}
          />
          <Autocomplete
            disablePortal
            id="from-currency-codes"
            options={currencyOptions}
            sx={{ width: 300, height: 50, margin: '4% auto auto auto' }}
            renderInput={(params) => <TextField {...params} label="From" />}
            onChange={(event: any, value: any) => {
              setFromCurrency(value);
            }}
            value={fromCurrency}
          />
          <Button
            startIcon={<SwapHorizIcon />}
            onClick={handleSwap}
            size="large"
            sx={{ height: 50, margin: '4% auto auto auto' }}
          ></Button>
          <Autocomplete
            disablePortal
            id="to-currency-codes"
            options={currencyOptions}
            sx={{ width: 300, height: 50, margin: '4% auto auto auto' }}
            renderInput={(params) => <TextField {...params} label="To" />}
            onChange={(event: any, value: any) => {
              setToCurrency(value);
            }}
            value={toCurrency}
          />
        </CardActions>
        <CardActions sx={{ justifyContent: 'right' }}>
          {displayResult && displayReset && (
            <CardContent sx={{ width: 300, margin: 'auto auto auto 2%' }}>
              <Typography variant="subtitle1">
                {`${displayResult.amountInput} ${formatString(
                  displayResult.fromCurrency,
                )} =`}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: '600',
                }}
              >
                {`${displayResult.convertedAmount} ${formatString(
                  displayResult.toCurrency,
                )}`}
              </Typography>
              <Typography variant="subtitle2">{`1 ${formatString(
                displayResult.fromCurrency,
              )} =  ${displayResult.conversionRate} ${formatString(
                displayResult.toCurrency,
              )}`}</Typography>
              <Typography variant="caption">{`Last Updated: ${rateLastUpdated} `}</Typography>
              <Typography variant="caption">
                <a href="https://www.exchangerate-api.com">
                  Rates By Exchange Rate API
                </a>
              </Typography>
            </CardContent>
          )}
          <Button
            sx={{
              margin: '1% 0.5% 3% 0',
              display: displayReset ? 'block' : 'none',
            }}
            size="medium"
            variant="outlined"
            onClick={handleReset}
          >
            <Typography
              align="center"
              paragraph
              sx={{
                margin: 'auto',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              Reset
            </Typography>
          </Button>
          <Button
            sx={{ margin: '1% 2.5% 3% 0' }}
            size="medium"
            onClick={handleConvertSubmit}
            variant="contained"
          >
            <Typography
              align="center"
              paragraph
              sx={{
                margin: 'auto',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              Convert
            </Typography>
          </Button>
        </CardActions>

        {displayError && (
          <Alert severity="error">
            An error occurred. Please try again later or contact the
            administrator.
          </Alert>
        )}
      </Card>
      {previousConversions.length > 0 && (
        <HistoryTable data={previousConversions}></HistoryTable>
      )}
    </>
  );
};

export default CurrencyForm;
