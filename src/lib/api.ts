import type { VerificationRequest } from '@/types/verification';
import type { Hex } from '@yodlpay/yapp-sdk';
import { Client } from './client';

const client = new Client();

export async function fetchBeerTaps(location: string) {
  const response = await client.provide('get /v1/beer-taps', { location });

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response;
}

export async function fetchStatus(txHash: Hex) {
  const response = await client.provide('get /v1/status/:txHash', { txHash });

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response;
}

// Verification API endpoints
export async function getVerificationConfig(tapId: string, walletAddress: string) {
  const response = await client.provide('post /v1/identity/config', { tapId, walletAddress });

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response;
}

export async function verifyIdentity(request: VerificationRequest) {
  const response = await client.provide('post /v1/identity/verify', request);

  if (response.status === 'error') {
    throw new Error(response.error);
  }

  return response;
}

export async function checkVerificationStatus(tapId: string, walletAddress: string) {
  const response = await client.provide('get /v1/identity/status/:walletAddress/:tapId', {
    tapId,
    walletAddress,
  });

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response;
}

export async function checkMultipleTapsStatus(tapIds: string[], walletAddress: string) {
  const statusPromises = tapIds.map(async tapId => {
    try {
      const status = await checkVerificationStatus(tapId, walletAddress);
      return {
        tapId,
        isVerified: status.data.isVerified,
        result: status.data.result,
        error: status.data.error,
      };
    } catch (error) {
      return {
        tapId,
        isVerified: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  return Promise.all(statusPromises);
}
