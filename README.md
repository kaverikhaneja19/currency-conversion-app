# Getting Started with Currency Conversion App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It uses [Material UI](https://mui.com/material-ui/) library to create components.

## Pre-requisites
Install [nodejs](https://nodejs.org/en/download).

## How to run

In the project directory:

1. Setup API key to get data from [ExchangeRate-API](https://www.exchangerate-api.com/). Create a `.env` file in the root and add:
`REACT_APP_CURRENCY_API_KEY = "<your-api-key>"`

2. Run `npm install` - Installs the required dependencies.
3. Run `npm start` - Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

4. `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## How to use

1. Input any numerical value in the `Amount` field.
2. Select currency in the `From` and `To` fields.
3. Click `Convert` to view the results.
4. You can view all your conversions in the `Previous Conversions` table.
5. Click `Reset` to erase all inputs and results.


## Future Improvements

1. Improve decimal inputs format without losing precision. For instance, if user enters 8.999999999999999999 in the `amount` field. The amount in history table is displayed as 9.
2. Display conversions in real time as user is editing.
3. Currently, this app does not handle very large inputs efficiently, like 899999999999999999999.999999999999.
3. Improve overall accessiblity of the application.
4. Add country flags.