import { SimpleConnectWallet } from '@/components/ConnectWallet';
import { Button } from '@/components/ui/button';
import type { PositiveResponse } from '@/lib/client';
import { useVerificationStatus } from '@/lib/verification-hooks';
import { useVerification } from '@/providers/VerificationProvider';
import { useMutation } from '@tanstack/react-query';
import YappSDK, { FiatCurrency } from '@yodlpay/yapp-sdk';
import { Shield } from 'lucide-react';

interface PurchaseButtonProps {
  beerTap: PositiveResponse['get /v1/beer-taps']['data']['beerTaps'][number];
  variant?: 'default' | 'outline' | 'secondary';
}

const sdk = new YappSDK();

export default function PurchaseButton({ beerTap, variant = 'default' }: PurchaseButtonProps) {
  const { walletAddress, openVerificationModal } = useVerification();
  const requiresVerification = beerTap.identityVerification?.enabled;

  const { data: verificationStatus } = useVerificationStatus(beerTap.id!, walletAddress, {
    enabled: requiresVerification,
  });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      // Check verification status before payment
      if (requiresVerification && !verificationStatus?.data.isVerified) {
        throw new Error('Identity verification required before purchase');
      }

      const { origin, pathname } = window.location;
      return await sdk.requestPayment({
        addressOrEns: beerTap.transactionReceiverEns,
        amount: parseFloat(beerTap.transactionAmount),
        currency: beerTap.transactionCurrency as FiatCurrency,
        memo: beerTap.transactionMemo,
        redirectUrl: `${origin}${pathname}`, // We don't want to pass params to the redirect url
      });
    },
    onSuccess: response => {
      console.log('Payment successful:', response);
    },
    onError: error => {
      console.error('Payment failed:', error);
    },
  });

  const handlePurchaseClick = () => {
    if (requiresVerification && !verificationStatus?.data.isVerified) {
      openVerificationModal(beerTap.id!);
      return;
    }
    paymentMutation.mutate();
  };

  // Show wallet connection button if wallet is not connected
  if (!walletAddress) {
    return (
      <div className='space-y-2'>
        <SimpleConnectWallet className='w-full' />
        <div className='text-xs text-muted-foreground text-center'>Connect your wallet to purchase</div>
      </div>
    );
  }

  if (paymentMutation.isSuccess) {
    return (
      <Button variant='outline' disabled>
        Purchase Successful ✓
      </Button>
    );
  }

  // Show verification button if verification is required and not verified
  if (requiresVerification && !verificationStatus?.data.isVerified) {
    return (
      <div className='space-y-2'>
        <Button onClick={handlePurchaseClick} variant={variant} className='w-full'>
          <Shield className='w-4 h-4 mr-2' />
          Verify to Purchase
        </Button>
        <div className='text-xs text-muted-foreground text-center'>Identity verification required for this beer</div>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <Button onClick={handlePurchaseClick} disabled={paymentMutation.isPending} variant={variant} className='w-full'>
        {paymentMutation.isPending
          ? 'Processing...'
          : `Buy for ${beerTap.transactionCurrency} ${beerTap.transactionAmount}`}
      </Button>
      {paymentMutation.isError && (
        <div className='text-sm text-red-600 text-center'>
          {paymentMutation.error instanceof Error &&
          paymentMutation.error.message === 'Identity verification required before purchase'
            ? 'Please verify your identity first'
            : paymentMutation.error instanceof Error && paymentMutation.error.message === 'Payment was cancelled'
              ? 'Payment cancelled'
              : `Payment failed: ${paymentMutation.error instanceof Error ? paymentMutation.error.message : 'Unknown error'}`}
        </div>
      )}
    </div>
  );
}
