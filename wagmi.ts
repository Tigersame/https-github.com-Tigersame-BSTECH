
// Fix: Using @wagmi/core and @wagmi/connectors to avoid circular dependency with 'wagmi.ts' shadowing the 'wagmi' package
import { createConfig, http } from '@wagmi/core';
import { base, baseSepolia } from 'viem/chains';
import { coinbaseWallet } from '@wagmi/connectors';

export function getConfig() {
  return createConfig({
    chains: [base, baseSepolia],
    connectors: [
      coinbaseWallet({
        appName: 'BSTECH',
        preference: 'smartWalletOnly',
      }),
    ],
    ssr: true,
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}

declare module '@wagmi/core' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
