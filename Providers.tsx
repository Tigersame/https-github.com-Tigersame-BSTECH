
import React, { type ReactNode, useState } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Fix: Import WagmiProvider from @wagmi/react to bypass the name collision with local wagmi.ts file
import { WagmiProvider } from '@wagmi/react';
import { base } from 'viem/chains';
import { getConfig } from './wagmi';

// Explicitly defining the children prop in the component interface to satisfy type checking
export function Providers({ children }: { children: ReactNode }) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: 'dark',
              theme: 'base',
            },
            wallet: {
              display: 'modal',
            },
          }}
          miniKit={{
            enabled: true
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
