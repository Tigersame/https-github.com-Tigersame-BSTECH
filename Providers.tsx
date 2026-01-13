
import React, { type ReactNode, useState } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi/react';
import { base } from 'viem/chains';
import { getConfig } from './wagmi';

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
