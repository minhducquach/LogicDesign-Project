import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/components/styles/index.css';
import '../src/components/styles/intial.css';
import '../src/components/styles/header.css';
import '../src/components/styles/error.css';
import '../src/components/styles/homepage.css'
import App from './App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
