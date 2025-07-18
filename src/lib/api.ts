import type { BeerTap, ServerResponse, StatusResponse } from '@/types/beer';
import type { Hex } from '@yodlpay/yapp-sdk';

const API_BASE_URL = 'https://yodl-store-webhook.fly.dev/v1';

export async function fetchBeerTaps(location: string): Promise<ServerResponse<BeerTap>> {
  const response = await fetch(`${API_BASE_URL}/beer-taps?location=${encodeURIComponent(location)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch beer taps: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchStatus(txHash: Hex): Promise<ServerResponse<StatusResponse>> {
  const response = await fetch(`${API_BASE_URL}/status/${txHash}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch status: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
