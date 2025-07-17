import { useAccount } from 'wagmi';

// Hook to get the current wallet address
export function useWalletAddress(): string | null {
  const { address, isConnected } = useAccount();
  return isConnected ? address || null : null;
}

// Get wallet address from wagmi context (for use in non-hook contexts)
export function getWalletAddress(): string | null {
  // This will be used in contexts where we can't use hooks
  // The actual wallet address will be passed as a parameter
  return null;
}

// Utility function to validate wallet address format
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Utility function to format wallet address for display
export function formatWalletAddress(address: string): string {
  if (!address || !isValidWalletAddress(address)) {
    return '';
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
