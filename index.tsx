import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * POLYFILL: Object.hasOwn
 * Fixes "Object.hasOwn is not a function" error in react-markdown 
 * and other modern ESM libraries.
 */
if (!Object.hasOwn) {
  Object.defineProperty(Object, 'hasOwn', {
    value: function (object: any, property: PropertyKey) {
      if (object == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }
      return Object.prototype.hasOwnProperty.call(object, property);
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Optional: Clear any existing content if using HMR
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);