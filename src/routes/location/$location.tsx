import BeerGrid from '@/components/BeerGrid';
import Container from '@/components/Container';
import LocationHeader from '@/components/LocationHeader';
import PaymentSuccessDialog from '@/components/PaymentSuccessDialog';
import { fetchBeerTaps } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/location/$location')({
  component: LocationPage,
});

function LocationPage() {
  const { location } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['beerTaps', location],
    queryFn: () => fetchBeerTaps(location),
  });

  if (isLoading) {
    return (
      <Container>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='text-lg'>Loading beer taps...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
          <div className='text-lg text-red-600'>Failed to load beer taps</div>
          <div className='text-sm text-gray-600'>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </div>
        </div>
      </Container>
    );
  }

  if (!data || data.data.beerTaps.length === 0) {
    return (
      <Container>
        <LocationHeader location={location} count={0} />
        <div className='flex flex-col items-center justify-center min-h-[40vh] gap-4'>
          <div className='text-lg'>No beer taps available</div>
          <div className='text-sm text-gray-600'>There are currently no beers on tap at {location.toUpperCase()}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PaymentSuccessDialog location={location} beerTapsResponse={data} />
      <LocationHeader location={location} count={data.data.beerTaps.length} />
      <BeerGrid beers={data.data.beerTaps} />
    </Container>
  );
}
