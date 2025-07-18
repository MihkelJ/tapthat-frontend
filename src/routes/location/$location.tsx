import BeerGrid from '@/components/BeerGrid';
import PaymentSuccessDialog from '@/components/PaymentSuccessDialog';
import { TapThatLogo } from '@/components/TapThatLogo';
import { TerminalDescription } from '@/components/TerminalDescription';
import { TerminalHeader } from '@/components/TerminalHeader';
import TerminalStatus from '@/components/TerminalStatus';
import { fetchBeerTaps } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

export const Route = createFileRoute('/location/$location')({
  component: LocationPage,
});

function LocationPage() {
  const { location } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['beerTaps', location],
    queryFn: () => fetchBeerTaps(location),
  });

  const LayoutWrapper = ({ children }: PropsWithChildren) => (
    <div className='min-h-screen bg-black text-green-400 font-mono'>
      <div className='container mx-auto px-4 py-8'>{children}</div>
    </div>
  );

  const CommonHeader = ({ isLoading = false }: { isLoading?: boolean }) => (
    <>
      <TerminalHeader isLoading={isLoading} />
      <TapThatLogo text={`${location.toUpperCase()} BEER TERMINAL`} />
    </>
  );

  if (isLoading) {
    return (
      <LayoutWrapper>
        <CommonHeader isLoading={true} />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <CommonHeader />
        <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center'>
          <div className='text-3xl sm:text-4xl md:text-5xl font-black text-red-600 tracking-tight'>
            Failed to load beer taps
          </div>
          <div className='text-xl sm:text-2xl text-green-600 font-bold'>
            {true ? error.message : 'Unknown error occurred'}
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (!data || data.data.beerTaps.length === 0) {
    return (
      <LayoutWrapper>
        <CommonHeader />
        <TerminalStatus location={location} count={data?.data.beerTaps.length ?? 0} />
        <TerminalDescription command={`cat ${location}_beer_taps.txt`}>
          No beer taps currently available at {location.toUpperCase()}.
          <br />
          Please check back later or try another location.
          <br />
          Contact support if this issue persists.
        </TerminalDescription>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <PaymentSuccessDialog location={location} beerTapsResponse={data} />
      <CommonHeader />
      <TerminalStatus location={location} count={data.data.beerTaps.length} />
      <TerminalDescription command={`cat ${location}_beer_taps.txt`}>
        Found {data.data.beerTaps.length} beer tap{data.data.beerTaps.length === 1 ? '' : 's'} at{' '}
        {location.toUpperCase()} location.
        <br />
        Ready for crypto payment transactions.
      </TerminalDescription>
      <BeerGrid beers={data.data.beerTaps} />
    </LayoutWrapper>
  );
}
