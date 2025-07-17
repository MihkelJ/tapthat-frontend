import BeerCard from '@/components/BeerCard';
import { BulkVerificationIndicator } from '@/components/BulkVerificationIndicator';
import type { PositiveResponse } from '@/lib/client';

interface BeerGridProps {
  beers: PositiveResponse['get /v1/beer-taps'];
}

export default function BeerGrid({ beers }: BeerGridProps) {
  const verificationRequiredTaps = beers.data.beerTaps.filter(beer => beer.identityVerification?.enabled);
  const showBulkVerification = verificationRequiredTaps.length > 1;

  return (
    <div className='space-y-6'>
      {showBulkVerification && (
        <BulkVerificationIndicator taps={verificationRequiredTaps} showDetails={verificationRequiredTaps.length > 3} />
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {beers.data.beerTaps.map(beer => (
          <BeerCard key={beer.id} beerTap={beer} />
        ))}
      </div>
    </div>
  );
}
