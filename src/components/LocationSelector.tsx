import { useLocation } from '@/hooks/useLocation';
import { Link } from '@tanstack/react-router';

interface LocationSelectorProps {
  onClose: () => void;
}

export function LocationSelector({ onClose }: LocationSelectorProps) {
  const { discoveredLocations, clearDiscoveredLocations } = useLocation();

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-black border border-green-700 rounded p-6 max-w-md w-full mx-4 font-mono'>
        <div className='flex items-center justify-between mb-4'>
          <div className='text-green-300 text-sm'>Discovered Locations:</div>
          <button
            onClick={onClose}
            className='text-green-400 hover:text-green-300 text-xl'
            aria-label='Close'
          >
            ×
          </button>
        </div>

        <div className='space-y-3 max-h-60 overflow-y-auto'>
          {discoveredLocations.map((location) => (
            <Link
              key={location.name}
              to='/location/$location'
              params={{ location: location.name }}
              onClick={onClose}
              className='block p-3 border border-green-700 rounded hover:border-green-500 hover:bg-green-950/40 transition-colors'
            >
              <div className='flex items-center gap-2 text-xs sm:text-sm'>
                <span className='text-green-400'>$</span>
                <span className='text-white'>cd /location/{location.name}</span>
              </div>
              <div className='text-xs text-green-600 ml-2 sm:ml-4 mt-1'>
                {location.beerCount} beer{location.beerCount === 1 ? '' : 's'} available
              </div>
              <div className='text-xs text-green-500 ml-2 sm:ml-4'>
                Discovered: {new Date(location.discoveredAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>

        {discoveredLocations.length === 0 && (
          <div className='text-center text-green-600 text-sm py-8'>
            No locations discovered yet.
            <br />
            Visit beer locations to unlock them!
          </div>
        )}

        <div className='mt-6 pt-4 border-t border-green-700 flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 text-xs border border-green-700 rounded hover:border-green-500 text-green-400 hover:bg-green-950/40 transition-colors'
          >
            Cancel
          </button>
          {discoveredLocations.length > 0 && (
            <button
              onClick={() => {
                clearDiscoveredLocations();
                onClose();
              }}
              className='px-4 py-2 text-xs border border-red-700 rounded hover:border-red-500 text-red-400 hover:bg-red-950/40 transition-colors'
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}