import { useLocation } from '@/hooks/useLocation';

export function SystemInfo() {
  const { isLocationUnlocked, discoveredLocations } = useLocation();
  return (
    <div className='mb-6 space-y-2 text-xs sm:text-sm'>
      <div className='flex flex-row gap-1 sm:gap-2 overflow-hidden'>
        <span className='text-green-300'>SYSTEM:</span>
        <span className='text-white text-xs sm:text-sm truncate'>CRYPTO POWERED SELF-SERVICE BEER TERMINAL</span>
      </div>
      <div>
        <span className='text-green-300'>STATUS:</span> <span className='text-green-400'>ONLINE</span>
      </div>
      <div className='flex flex-row gap-1 sm:gap-2 overflow-hidden'>
        <span className='text-green-300'>PAYMENT:</span>
        <span className='text-yellow-400 text-xs sm:text-sm truncate'>YOUR WALLET | ANY TOKEN | ANY CHAIN</span>
      </div>
      <div className='flex flex-row gap-1 sm:gap-2 overflow-hidden'>
        <span className='text-green-300'>LOCATIONS:</span>
        <span className={`text-xs sm:text-sm truncate ${isLocationUnlocked ? 'text-green-400' : 'text-yellow-600'}`}>
          {isLocationUnlocked 
            ? `${discoveredLocations.length} DISCOVERED` 
            : 'LOCKED - FIND BEER TO UNLOCK'
          }
        </span>
      </div>
    </div>
  );
}