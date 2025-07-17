import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import YappSDK, { type Hex, type PaymentSimple } from '@yodlpay/yapp-sdk';
import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchStatus } from '@/lib/api';
import type { PositiveResponse } from '@/lib/client';
import { cn } from '@/lib/utils';

interface PaymentSuccessDialogProps {
  location: string;
  beerTapsResponse: PositiveResponse['get /v1/beer-taps'];
}

export default function PaymentSuccessDialog({ location, beerTapsResponse }: PaymentSuccessDialogProps) {
  const search = useSearch({ strict: false }) as { txHash?: string };
  const [isOpen, setIsOpen] = useState(false);

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

    setIsOpen(true);
    return payment;
  };

  const {
    data: payment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['payment', txHash],
    queryFn: validatePayment,
    enabled: !!txHash,
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
      return isTerminalState ? false : 1000;
    },
  });

  const title = useMemo(() => {
    switch (statusResponse?.status) {
      case 'not_found':
        return 'Searching for Suds...';
      case 'processing':
        return 'Pouring Your Beer...';
      case 'queued':
        return 'Beer Queue: Anticipation Rising!';
      case 'completed':
        return 'Cheers! Your beer is ready.';
      case 'failed':
        return 'No Beer for You (Payment Failed)';
      default:
        return 'Status: Unknown Brew';
    }
  }, [statusResponse]);

  const description = useMemo(() => {
    switch (statusResponse?.status) {
      case 'completed':
        return `🍻 Cheers! Your beer at ${location.toUpperCase()} is ready. Enjoy every sip!`;
      case 'failed':
        return `😢 Oops! Something went wrong with your beer order at ${location.toUpperCase()}. No suds this time.`;
      case 'not_found':
        return `🔍 We're looking for your payment at ${location.toUpperCase()}... hang tight, your beer adventure is loading!`;
      case 'queued':
        return `⏳ You're in queue position ${statusResponse.queuePosition} for a beer at ${location.toUpperCase()}. The tap is almost yours!`;
      case 'processing':
        return `🍺 Your beer at ${location.toUpperCase()} is being poured. Get ready!`;
      default:
        return `🕒 Your beer purchase at ${location.toUpperCase()} is being processed. Stay thirsty!`;
    }
  }, [statusResponse, location]);

  const shouldShowDialog = txHash && !isLoading && !error && payment && statusResponse;

  if (!shouldShowDialog) {
    return null;
  }

  const handleClose = () => {
    if (statusResponse?.status !== 'completed') {
      return;
    }

    return setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <CheckCircle2 className='h-8 w-8 text-green-600' />
          </div>
          <DialogTitle className='text-xl'>{title}</DialogTitle>
          <DialogDescription className='text-base'>{description}</DialogDescription>
        </DialogHeader>

        <div className={cn('mt-4', statusResponse?.status !== 'completed' && 'hidden')}>
          <Button onClick={handleClose} className='w-full'>
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
