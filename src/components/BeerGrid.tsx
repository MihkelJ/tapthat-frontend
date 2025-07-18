import BeerCard from '@/components/BeerCard';
import type { PositiveResponse } from '@/lib/client.ts';

interface BeerGridProps {
  beers: PositiveResponse['get /v1/beer-taps']['data']['beerTaps'];
}

export default function BeerGrid({ beers }: BeerGridProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'>
      {beers.map(beer => (
        <BeerCard key={beer.id} beerTap={beer} />
      ))}
    </div>
  );
}
