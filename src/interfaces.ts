export interface Data {
  amountInput: string;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: string;
}
export interface ColumnData {
  dataKey: keyof Data;
  label: string;
  numeric?: boolean;
  width: number;
}

export interface ConversionData {
  amountInput: string;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: string;
  conversionRate?: number;
}
