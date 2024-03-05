import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import * as buffer from "buffer";
import { Wallet } from './Wallet';
import "./index.css"
window.Buffer = buffer.Buffer;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Wallet />
  </React.StrictMode>
);

reportWebVitals();
