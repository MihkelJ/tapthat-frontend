import type { Hex } from '@yodlpay/yapp-sdk';

export interface BeerTap {
  beerTaps: {
    id: string;
    title: string;
    location: string;
    description: string;
    transactionCurrency: string;
    transactionAmount: string;
    transactionMemo: string;
    transactionReceiverEns: string;
  }[];
}

export interface StatusResponse {
  status: 'not_found' | 'queued' | 'processing' | 'completed' | 'failed';
  txHash: Hex;
  queuePosition?: number;
}

export interface ServerResponse<T> {
  status: string;
  data: T;
}
