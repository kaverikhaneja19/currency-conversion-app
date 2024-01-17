import { fetchCurrencyCodes } from './helper';

beforeEach(() => {
  global.fetch = jest.fn();
});

test('fetches and formats supported currency codes successfully', async () => {
  const currencyCodes = {
    json: jest.fn().mockResolvedValueOnce({
      supported_codes: [
        ['AED', 'UAE Dirham'],
        ['AFN', 'Afghan Afghani'],
        ['ALL', 'Albanian Lek'],
        ['AMD', 'Armenian Dram'],
        ['ANG', 'Netherlands Antillian Guilder'],
      ],
    }),
  };

  global.fetch.mockResolvedValueOnce(Promise.resolve(currencyCodes));

  const options = await fetchCurrencyCodes();

  expect(options).toEqual([
    'AED - UAE Dirham',
    'AFN - Afghan Afghani',
    'ALL - Albanian Lek',
    'AMD - Armenian Dram',
    'ANG - Netherlands Antillian Guilder',
  ]);
});
