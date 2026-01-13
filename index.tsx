
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './Providers';
import { sdk } from '@farcaster/miniapp-sdk';

const Root = () => {
  useEffect(() => {
    // Signals to the Farcaster environment that the app is ready to be displayed,
    // hiding the loading splash screen.
    const initialize = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error("Failed to signal readiness to Farcaster:", error);
      }
    };
    initialize();
  }, []);

  return (
    // Passing children as an explicit prop to resolve TypeScript error reporting missing children
    <Providers children={<App />} />
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
