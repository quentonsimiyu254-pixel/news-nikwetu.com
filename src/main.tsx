
/**
 * POLYFILLS: Universal Compatibility
 * Must be at the very top to ensure libraries like react-markdown 
 * find these methods during their initial evaluation.
 */
(function applyPolyfills() {
  if (typeof (Object as any).hasOwn !== 'function') {
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
})();

import React from 'react';
// @ts-ignore // react-dom/client has no bundled typings in this environment
import ReactDOM from 'react-dom/client';
import App from '../App';

// Container element selection
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found. Check index.html for <div id='root'></div>");
} else {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
