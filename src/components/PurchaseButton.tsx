import type { BeerTap } from '@/types/beer';
import ASCIIBeerAnimation from '@/components/ASCIIBeerAnimation';
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
      // Try to use the actual Yodl SDK if available, otherwise fallback to direct URL
      try {
        // Import and use the real Yodl SDK
        import('@yodlpay/yapp-sdk')
          .then(async yappModule => {
            const YappSDK = yappModule.default;
            const sdk = new YappSDK();

            await sdk.requestPayment({
              addressOrEns: beerTap.transactionReceiverEns,
              amount: parseFloat(beerTap.transactionAmount),
              currency: beerTap.transactionCurrency as any,
              memo: `${beerTap.title} - ${beerTap.location}`,
              redirectUrl: `${origin}${pathname}?success=true&paymentId={payment_id}`,
            });
          })
          .catch(error => {
            console.error('Yodl SDK error, falling back to direct redirect:', error);
            // Fallback to direct URL redirect
            const yodlBaseUrl = 'https://app.yodl.me/pay';
            const paymentParams = new URLSearchParams({
              address: beerTap.transactionReceiverEns,
              amount: beerTap.transactionAmount,
              currency: beerTap.transactionCurrency,
              memo: `${beerTap.title} - ${beerTap.location}`,
              redirectUrl: `${origin}${pathname}?success=true&paymentId={payment_id}`,
            });

            const yodlPaymentUrl = `${yodlBaseUrl}?${paymentParams.toString()}`;
            console.log('Redirecting to Yodl:', yodlPaymentUrl);
            window.location.href = yodlPaymentUrl;
          });
      } catch (error) {
        console.error('Failed to load Yodl SDK:', error);
        setShowAnimation(false);
        setIsPending(false);
        alert('Payment failed to initialize. Please try again.');
      }
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
