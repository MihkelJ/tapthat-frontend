import { useLocation } from '@/hooks/useLocation';
import { useState } from 'react';
import { LocationSelector } from './LocationSelector';

export function CommandsMenu() {
  const { isLocationUnlocked } = useLocation();
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  return (
    <div className='w-full'>
      <div className='text-green-300 mb-4 text-xs sm:text-sm'>Available commands:</div>
      <div className='space-y-4 max-w-full sm:max-w-md'>
        {isLocationUnlocked ? (
          <div
            className='mb-4 p-3 rounded border border-green-700 bg-green-950/40 hover:bg-green-900/40 hover:border-green-500 transition-colors cursor-pointer'
            onClick={() => setShowLocationSelector(true)}
          >
            <div className='text-xs sm:text-sm flex items-center gap-2'>
              <span className='text-green-400'>$</span>
              <span className='text-white'>view_locations</span>
              <span className='text-green-400 text-[10px] sm:text-xs font-mono'>(unlocked)</span>
            </div>
            <div className='text-xs text-green-600 ml-2 sm:ml-4 mt-1'>Navigate between discovered beer locations</div>
          </div>
        ) : (
          <div className='mb-4 p-3 rounded border border-green-700 bg-green-950/40 opacity-60 cursor-not-allowed select-none'>
            <div className='text-xs sm:text-sm flex items-center gap-2'>
              <span className='text-green-400'>$</span>
              <span className='text-white line-through'>view_locations</span>
              <span className='text-yellow-400 text-[10px] sm:text-xs font-mono'>(disabled)</span>
            </div>
            <div className='text-xs text-green-600 ml-2 sm:ml-4 mt-1'>Try to find your nearest tap location!</div>
          </div>
        )}

        <div className='hover:bg-green-900/20 p-3 rounded border border-green-700 hover:border-green-500 transition-colors cursor-pointer'>
          <div className='text-xs sm:text-sm'>
            <span className='text-green-400'>$</span> <span className='text-white'>system_info</span>
          </div>
          <div className='text-xs text-green-600 ml-2 sm:ml-4 mt-1'>Hackable self-service tap protocol</div>
        </div>

        <div className='text-purple-400 text-xs mt-2'>powered by yodl</div>
      </div>

      {showLocationSelector && <LocationSelector onClose={() => setShowLocationSelector(false)} />}
    </div>
  );
}
