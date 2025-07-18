import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { VerificationProvider } from './VerificationProvider';
import { LocationProvider } from './LocationProvider';

import { router } from '../router';
import { wagmiConfig } from '../lib/wagmi';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

// Create a new query client
const queryClient = new QueryClient();

export function AppProviders() {
  return (
    <StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <VerificationProvider>
              <LocationProvider>
                <RouterProvider router={router} />
              </LocationProvider>
            </VerificationProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
}
