import ASCIIBeerAnimation from '@/components/ASCIIBeerAnimation';
import type { BeerTap } from '@/types/beer';
import YappSDK, { FiatCurrency } from '@yodlpay/yapp-sdk';
import { useState } from 'react';

interface PurchaseButtonProps {
  beerTap: BeerTap['beerTaps'][number];
}

export default function PurchaseButton({ beerTap }: PurchaseButtonProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handlePaymentRedirect = async () => {
    const { origin, pathname } = window.location;

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
      });
    }, 1000); // 1 second delay to show animation
  };

  if (showAnimation) {
    return <ASCIIBeerAnimation />;
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
