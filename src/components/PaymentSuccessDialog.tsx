import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import YappSDK, { type Hex, type PaymentSimple } from '@yodlpay/yapp-sdk';
import { RefreshCw, Shield, Terminal, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchStatus } from '@/lib/api';
import type { PositiveResponse } from '@/lib/client';

interface PaymentSuccessDialogProps {
  location: string;
  beerTapsResponse: PositiveResponse['get /v1/beer-taps'];
}

export default function PaymentSuccessDialog({ location, beerTapsResponse }: PaymentSuccessDialogProps) {
  const search = useSearch({ strict: false }) as { txHash?: string };
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);

  const txHash = search.txHash;

  const validatePayment = async (): Promise<PaymentSimple> => {
    const sdk = new YappSDK();
    const payment = await sdk.getPayment(txHash as Hex);

    if (!payment) {
      throw new Error('Payment not found');
    }

    const beerTap = beerTapsResponse.data.beerTaps.find(tap => tap.transactionMemo === payment.memo);

    if (!beerTap) {
      throw new Error('Beer tap not found for this payment');
    }

    const isAmountValid = payment.invoiceAmount >= beerTap.transactionAmount;
    const isCurrencyValid = payment.invoiceCurrency === beerTap.transactionCurrency;

    if (!isAmountValid || !isCurrencyValid) {
      throw new Error('Payment amount or currency does not match beer tap requirements');
    }

    return payment;
  };

  const {
    isLoading,
    error,
    refetch: retryPaymentValidation,
  } = useQuery({
    queryKey: ['payment', txHash, retryCount],
    queryFn: validatePayment,
    enabled: !!txHash,
    retry: 3,
  });

  const { data: statusResponse } = useQuery({
    queryKey: ['status', txHash],
    queryFn: async () => {
      const status = await fetchStatus(txHash as Hex);
      return status.data;
    },
    enabled: !!txHash,
    refetchInterval: query => {
      const data = query.state.data;
      const isTerminalState = data?.status === 'completed' || data?.status === 'failed';
      return isTerminalState ? false : 500;
    },
  });

  const title = useMemo(() => {
    switch (statusResponse?.status) {
      case 'not_found':
        return 'SCANNING BLOCKCHAIN...';
      case 'processing':
        return 'EXECUTING BEER.EXE...';
      case 'queued':
        return 'QUEUED IN BEER PROTOCOL';
      case 'completed':
        return 'HACK SUCCESSFUL - BEER ACQUIRED';
      case 'failed':
        return 'ACCESS DENIED - PAYMENT FAILED';
      default:
        return 'STATUS: BOOTING...';
    }
  }, [statusResponse]);

  const description = useMemo(() => {
    switch (statusResponse?.status) {
      case 'completed':
        return `[SUCCESS] Beer dispensed at terminal ${location.toUpperCase()}. Access granted to liquid payload.`;
      case 'failed':
        return `[ERROR] Transaction rejected by beer protocol at node ${location.toUpperCase()}. System locked down.`;
      case 'not_found':
        return `[SCANNING] Probing blockchain for payment hash at ${location.toUpperCase()} terminal...`;
      case 'queued':
        return `[QUEUE] Position ${statusResponse.queuePosition} in beer protocol stack at ${location.toUpperCase()}. Awaiting execution...`;
      case 'processing':
        return `[PROCESSING] Beer.exe running at ${location.toUpperCase()} node. Compilation in progress...`;
      default:
        return `[BOOTING] Initializing payment protocol at ${location.toUpperCase()} terminal...`;
    }
  }, [statusResponse, location]);

  const handleClose = () => {
    navigate({
      to: '/location/$location',
      params: { location },
      search: {},
    });
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    retryPaymentValidation();
  };

  return (
    <Dialog open={!!txHash} onOpenChange={open => !open && handleClose()}>
      <DialogContent className='sm:max-w-md bg-black border-2 border-green-700 font-mono'>
        <DialogHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-green-700 bg-black'>
            {isLoading ? (
              <Terminal className='h-8 w-8 text-green-400 animate-pulse' />
            ) : error ? (
              <Shield className='h-8 w-8 text-green-400' />
            ) : (
              <Zap className='h-8 w-8 text-green-400' />
            )}
          </div>
          <DialogTitle className='text-xl text-green-400 tracking-wide'>
            {isLoading ? 'INITIALIZING PAYMENT PROTOCOL...' : error ? 'AUTHENTICATION FAILED' : title?.toUpperCase()}
          </DialogTitle>
          <DialogDescription className='text-sm text-green-300 mt-2'>
            {isLoading
              ? '> Initiating blockchain handshake protocol...'
              : error
                ? `> CRITICAL ERROR: ${error.message}`
                : `> ${description}`}
          </DialogDescription>
        </DialogHeader>

        <div className='mt-6 space-y-2'>
          {error ? (
            <>
              <button
                onClick={handleRetry}
                className='w-full font-mono px-4 py-3 bg-black border-2 border-green-700 text-green-400 text-sm hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors flex items-center justify-center'
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                RETRY AUTHENTICATION
              </button>
              <button
                onClick={handleClose}
                className='w-full font-mono px-4 py-3 bg-black border-2 border-green-700 text-green-400 text-sm hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors'
              >
                ABORT SESSION
              </button>
            </>
          ) : statusResponse?.status === 'completed' ? (
            <button
              onClick={handleClose}
              className='w-full font-mono px-4 py-3 bg-black border-2 border-green-700 text-green-400 text-sm hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors'
            >
              CONTINUE HACKING
            </button>
          ) : statusResponse?.status === 'failed' ? (
            <button
              onClick={handleClose}
              className='w-full font-mono px-4 py-3 bg-black border-2 border-green-700 text-green-400 text-sm hover:bg-green-900/30 hover:border-green-500 hover:text-green-300 transition-colors'
            >
              DISCONNECT
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
