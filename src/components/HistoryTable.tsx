import { Typography, TableCell, TableRow, Paper } from '@mui/material';
import { TableVirtuoso } from 'react-virtuoso';
import { ColumnData, Data } from '../interfaces';

const columns: ColumnData[] = [
  {
    width: 120,
    label: 'Amount',
    dataKey: 'amountInput',
  },
  {
    width: 120,
    label: 'From',
    dataKey: 'fromCurrency',
  },
  {
    width: 120,
    label: 'To',
    dataKey: 'toCurrency',
  },
  {
    width: 120,
    label: 'Conversion',
    dataKey: 'convertedAmount',
    numeric: true,
  },
];

const rowItems = (_index: number, row: Data) => {
  return (
    <>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric === true ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </>
  );
};

const fixedHeaderContent = () => {
  return (
    <>
      <TableRow sx={{ backgroundColor: '#eae4f7' }}>
        <TableCell colSpan={4}>
          <Typography
            align="center"
            variant="h5"
            sx={{
              margin: 'auto',
              color: '#483248',
              fontSize: '1.5rem',
              fontWeight: '600',
            }}
          >
            Previous Conversions
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.numeric === true ? 'right' : 'left'}
            style={{ width: column.width }}
            sx={{
              backgroundColor: 'background.paper',
            }}
          >
            <Typography
              paragraph
              sx={{
                margin: 'auto',
                color: '#483248',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              {column.label}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

export const HistoryTable = (props: any) => {
  return (
    <Paper style={{ height: 400, width: '40%', margin: '2% auto 2% auto' }}>
      <TableVirtuoso
        data={props.data}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowItems}
      />
    </Paper>
  );
};
