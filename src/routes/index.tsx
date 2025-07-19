import { CommandsMenu } from '@/components/CommandsMenu';
import { SystemInfo } from '@/components/SystemInfo';
import { TapThatLogo } from '@/components/TapThatLogo';
import { TerminalDescription } from '@/components/TerminalDescription';
import { TerminalHeader } from '@/components/TerminalHeader';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useLocation } from '@/hooks/useLocation';
import { useEffect, useRef } from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchBeerTaps } from '@/lib/api';

interface HomeSearch {
  unlock?: string[];
}

export const Route = createFileRoute('/')({
  component: App,
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return {
      unlock: search.unlock ? String(search.unlock).split(',').filter(Boolean) : undefined,
    };
  },
});

function App() {
  const search = useSearch({ from: '/' });
  const { addDiscoveredLocation } = useLocation();
  const processedLocations = useRef(new Set<string>());

  // Use queries to fetch beer count for all unlock locations
  const locationQueries = useQueries({
    queries: (search.unlock || []).map((location) => ({
      queryKey: ['beerTaps', location],
      queryFn: () => fetchBeerTaps(location),
      enabled: !!location,
    })),
  });

  // Update discovered locations when queries complete
  useEffect(() => {
    if (!search.unlock) return;

    search.unlock.forEach((location, index) => {
      // Skip if we've already processed this location
      if (processedLocations.current.has(location)) return;

      const query = locationQueries[index];
      if (query?.isSuccess && query.data) {
        const beerCount = query.data.data.beerTaps.length;
        addDiscoveredLocation(location, beerCount);
        processedLocations.current.add(location);
      } else if (query?.isError) {
        console.warn(`Failed to fetch beer count for ${location}:`, query.error);
        // Fallback to 0 beers if API call fails
        addDiscoveredLocation(location, 0);
        processedLocations.current.add(location);
      }
    });
  }, [search.unlock, locationQueries.map(q => q.status).join(','), addDiscoveredLocation]);

  return (
    <div className='min-h-screen bg-black text-green-400 font-mono'>
      <div className='container mx-auto px-4 py-8'>
        <TerminalHeader />
        <TapThatLogo text='TapThat' />
        <SystemInfo />
        <TerminalDescription />
        <CommandsMenu />
      </div>
    </div>
  );
}
