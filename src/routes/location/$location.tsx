import BeerGrid from '@/components/BeerGrid';
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
      <div className='min-h-screen bg-black text-green-400 font-mono'>
        <div className='container mx-auto px-4 py-8'>
          {/* Terminal Header */}
          <div className='w-full mb-4'>
            <div className='text-green-300 text-xs sm:text-sm mb-2'>$ ssh user@tapthat.terminal</div>
            <div className='text-green-500 text-xs sm:text-sm mb-4'>Connection established...</div>
          </div>

          {/* TAPTHAT Logo - Retroctech Font */}
          <div className='mb-6 text-left w-full'>
            <div className='flex items-center gap-4 sm:gap-6 overflow-hidden'>
              <div className='text-5xl sm:text-6xl lg:text-7xl font-bold tracking-wider text-green-400 py-4 font-retro'>
                TAPTHAT<span className='cursor-blink'>_</span>
              </div>
              <div className='flex flex-col items-center'>
                {/* Beer Mug */}
                <div className='text-green-400 font-mono text-lg sm:text-xl lg:text-2xl beer-bounce'>
                  <pre className='leading-tight'>{`
 ░░░░░
 ███████
 █████ █
 █████ █
 █████ █
 ██████
 █████
                  `}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-3xl sm:text-4xl md:text-5xl font-black text-center tracking-tight'>
              Loading beer taps...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-black text-green-400 font-mono'>
        <div className='container mx-auto px-4 py-8'>
          {/* Terminal Header */}
          <div className='w-full mb-4'>
            <div className='text-green-300 text-xs sm:text-sm mb-2'>$ ssh user@tapthat.terminal</div>
            <div className='text-green-500 text-xs sm:text-sm mb-4'>Connection established...</div>
          </div>

          <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center'>
            <div className='text-3xl sm:text-4xl md:text-5xl font-black text-red-600 tracking-tight'>
              Failed to load beer taps
            </div>
            <div className='text-xl sm:text-2xl text-green-600 font-bold'>
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.data.beerTaps.length === 0) {
    return (
      <div className='min-h-screen bg-black text-green-400 font-mono'>
        <div className='container mx-auto px-4 py-8'>
          <LocationHeader location={location} count={0} />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black text-green-400 font-mono'>
      <div className='container mx-auto px-4 py-8'>
        <PaymentSuccessDialog location={location} beerTapsResponse={data} />
        <LocationHeader location={location} count={data.data.beerTaps.length} />
        <BeerGrid beers={data.data.beerTaps} />
      </div>
    </div>
  );
}
