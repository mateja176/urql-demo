import { devtoolsExchange } from '@urql/devtools';
import { offlineExchange } from '@urql/exchange-graphcache';
import React from 'react';
import ReactDOM from 'react-dom';
import { createClient, defaultExchanges, Provider } from 'urql';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { SoilAnalysis, SoilAnalysisUpdateInput } from './types';

const url = process.env.REACT_APP_URL;

if (!url) {
  throw new Error('No URL provided.');
}

interface Options {
  optimistic: {
    updateSoilAnalysis: (variables: {
      soilAnalysisUpdateInput: SoilAnalysisUpdateInput;
    }) => SoilAnalysis;
  };
}

const client = createClient({
  url,
  exchanges: [
    devtoolsExchange,
    offlineExchange<Options>({
      optimistic: {
        updateSoilAnalysis: ({ soilAnalysisUpdateInput }) => ({
          __typename: 'SoilAnalysis',
          ...soilAnalysisUpdateInput,
        }),
      },
    }),
    ...defaultExchanges,
  ],
});

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
