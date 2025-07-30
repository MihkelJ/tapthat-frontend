import ASCIIBeerAnimation from '@/components/ASCIIBeerAnimation';
import { SimpleConnectWallet } from '@/components/ConnectWallet.tsx';
import type { PositiveResponse } from '@/lib/client';
import { useVerificationStatus } from '@/lib/verification-hooks.ts';
import { useVerification } from '@/providers/VerificationProvider.tsx';
import YappSDK, { FiatCurrency } from '@yodlpay/yapp-sdk';
import { Shield } from 'lucide-react';
import { useState } from 'react';

// Here we get the address of the app that will receive the webhook
const TAP_THAT_APP_ADDRESS = '0x82dA383CC35a8e293743e94100A4Db5E9DC0D74D';

interface PurchaseButtonProps {
  beerTap: PositiveResponse['get /v1/beer-taps']['data']['beerTaps'][number];
}

export default function PurchaseButton({ beerTap }: PurchaseButtonProps) {
  const { walletAddress, openVerificationModal } = useVerification();

  const requiresVerification = beerTap.identityVerification?.enabled;

  const { data: verificationStatus } = useVerificationStatus(beerTap.id!, walletAddress, {
    enabled: requiresVerification,
  });

  const [showAnimation, setShowAnimation] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handlePaymentRedirect = async () => {
    const { origin, pathname } = window.location;

    // Check verification status before payment
    if (requiresVerification && !verificationStatus?.data.isVerified) {
      openVerificationModal(beerTap.id!);
      return;
    }

    // Show animation first
    setShowAnimation(true);
    setIsPending(true);

    // Wait a moment for the animation to show
    setTimeout(() => {
      const sdk = new YappSDK();

      sdk.requestPayment({
        addressOrEns: beerTap.transactionReceiverEns,
        amount: parseFloat(beerTap.transactionAmount),
        currency: beerTap.transactionCurrency as FiatCurrency,
        memo: beerTap.transactionMemo,
        redirectUrl: `${origin}${pathname}`,
        webhooks: [{ webhookAddress: TAP_THAT_APP_ADDRESS }],
      });
    }, 1000); // 1 second delay to show animation
  };

  if (showAnimation) {
    return <ASCIIBeerAnimation />;
  }

  if (requiresVerification && !verificationStatus?.data.isVerified) {
    if (!walletAddress) {
      return (
        <div className='space-y-2'>
          <SimpleConnectWallet className='w-full' />
          <div className='text-xs text-muted-foreground text-center'>Connect your wallet to purchase</div>
        </div>
      );
    }

    return (
      <div className='space-y-2'>
        <button
          type='button'
          onClick={() => openVerificationModal(beerTap.id!)}
          className='w-full font-mono px-4 py-3 bg-black border-2 border-green-700 text-green-400
                 text-sm hover:bg-green-900/30 hover:border-green-500 hover:text-green-300
                 transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                 disabled:hover:bg-black disabled:hover:border-green-700 disabled:hover:text-green-400'
        >
          <Shield className='w-4 h-4 mr-2 inline' />
          Authenticate
        </button>
        <div className='text-xs text-muted-foreground text-center'>Identity verification required for this beer</div>
      </div>
    );
  }

  return (
    <button
      onClick={handlePaymentRedirect}
      disabled={isPending}
      className='w-full font-mono px-4 py-3 bg-black border-2 border-green-700 text-green-400
                 text-sm hover:bg-green-900/30 hover:border-green-500 hover:text-green-300
                 transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                 disabled:hover:bg-black disabled:hover:border-green-700 disabled:hover:text-green-400'
    >
      {isPending ? '$ processing_payment...' : `$ purchase_beer --price=${beerTap.transactionAmount}`}
    </button>
  );
}
