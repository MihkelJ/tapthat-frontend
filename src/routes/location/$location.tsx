import BeerGrid from '@/components/BeerGrid';
import LocationHeader from '@/components/LocationHeader';
import PaymentSuccessDialog from '@/components/PaymentSuccessDialog';
import { fetchBeerTaps } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/location/$location')({
  component: LocationPage,
});

// Mock data for demo location
const mockBeerTaps = {
  status: 'success' as const,
  data: {
    beerTaps: [
      {
        id: '1',
        title: 'Crypto IPA',
        location: 'demo',
        description:
          '**ABV: 6.5%** | **IBU: 65**\n\nA bold and hoppy India Pale Ale with citrus and pine notes. Brewed with Mosaic and Citra hops for maximum flavor.\n\n*Tasting Notes:*\n- Grapefruit and tropical fruit aromas\n- Balanced malt backbone\n- Clean, crisp finish',
        transactionReceiverEns: 'demo.eth',
        transactionAmount: '5.00',
        transactionCurrency: 'USD',
        transactionMemo: 'Crypto IPA - TapThat Demo',
      },
      {
        id: '2',
        title: 'Blockchain Lager',
        location: 'demo',
        description:
          '**ABV: 4.8%** | **IBU: 22**\n\nA smooth and refreshing lager with German heritage. Perfect for those who prefer a lighter, more sessionable beer.\n\n*Tasting Notes:*\n- Clean and crisp\n- Subtle hop character\n- Refreshing finish',
        transactionReceiverEns: 'demo.eth',
        transactionAmount: '4.50',
        transactionCurrency: 'USD',
        transactionMemo: 'Blockchain Lager - TapThat Demo',
      },
      {
        id: '3',
        title: 'DeFi Stout',
        location: 'demo',
        description:
          '**ABV: 7.2%** | **IBU: 35**\n\nRich and complex imperial stout with notes of chocolate and coffee. Aged in bourbon barrels for depth.\n\n*Tasting Notes:*\n- Dark chocolate and espresso\n- Vanilla and oak from barrel aging\n- Full-bodied with warming finish',
        transactionReceiverEns: 'demo.eth',
        transactionAmount: '6.00',
        transactionCurrency: 'USD',
        transactionMemo: 'DeFi Stout - TapThat Demo',
      },
      {
        id: '4',
        title: 'NFT Wheat',
        location: 'demo',
        description:
          '**ABV: 5.2%** | **IBU: 15**\n\nUnfiltered wheat beer with coriander and orange peel. Light, refreshing, and perfect for any season.\n\n*Tasting Notes:*\n- Citrus and spice aromatics\n- Smooth, creamy texture\n- Light and refreshing',
        transactionReceiverEns: 'demo.eth',
        transactionAmount: '4.75',
        transactionCurrency: 'USD',
        transactionMemo: 'NFT Wheat - TapThat Demo',
      },
    ],
  },
};

function LocationPage() {
  const { location } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['beerTaps', location],
    queryFn: async () => {
      // Use mock data for demo location during development
      if (location === 'demo') {
        return mockBeerTaps;
      }
      return fetchBeerTaps(location);
    },
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

          {/* Demo Beer Taps Title */}
          <div className='mb-6 text-left w-full'>
            <div className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-green-400 py-4 font-retro'>
              DEMO BEER TAPS<span className='cursor-blink'>_</span>
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

          {/* Demo Beer Taps Title */}
          <div className='mb-6 text-left w-full'>
            <div className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-green-400 py-4 font-retro'>
              DEMO BEER TAPS<span className='cursor-blink'>_</span>
            </div>
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

          {/* Demo Beer Taps Title */}
          <div className='mb-6 text-left w-full'>
            <div className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-green-400 py-4 font-retro'>
              DEMO BEER TAPS<span className='cursor-blink'>_</span>
            </div>
          </div>

          <LocationHeader location={location} count={0} />
          <div className='flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center'>
            <div className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight'>No beer taps available</div>
            <div className='text-xl sm:text-2xl text-green-600 font-bold'>
              There are currently no beers on tap at {location.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black text-green-400 font-mono'>
      <div className='container mx-auto px-4 py-8'>
        {/* Demo Beer Taps Title */}
        <div className='mb-6 text-left w-full'>
          <div className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-green-400 py-4 font-retro'>
            DEMO BEER TAPS<span className='cursor-blink'>_</span>
          </div>
        </div>

        <PaymentSuccessDialog location={location} beerTapsResponse={data} />
        <LocationHeader location={location} count={data.data.beerTaps.length} />
        <BeerGrid beers={data.data.beerTaps} />
      </div>
    </div>
  );
}
