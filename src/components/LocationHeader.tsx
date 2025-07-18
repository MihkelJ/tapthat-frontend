interface LocationHeaderProps {
  location: string;
  count: number;
}

export default function LocationHeader({ location, count }: LocationHeaderProps) {
  return (
    <div className='mb-8 w-full'>
      {/* Terminal location info */}
      <div className='mb-6 space-y-2 text-xs sm:text-sm'>
        <div className='flex flex-row gap-1 sm:gap-2 overflow-hidden'>
          <span className='text-green-300'>LOCATION:</span>
          <span className='text-white text-xs sm:text-sm truncate'>{location.toUpperCase()} BEER TERMINAL</span>
        </div>
        <div>
          <span className='text-green-300'>STATUS:</span> <span className='text-green-400'>ONLINE</span>
        </div>
        <div className='flex flex-row gap-1 sm:gap-2 overflow-hidden'>
          <span className='text-green-300'>TAPS:</span>
          <span className='text-yellow-400 text-xs sm:text-sm truncate'>
            {count === 0 ? 'NO BEERS AVAILABLE' : `${count} BEER${count === 1 ? '' : 'S'} ON TAP`}
          </span>
        </div>
      </div>

      {/* Terminal command output */}
      <div className='mb-6 text-green-400 w-full'>
        <div className='text-green-300 mb-2 text-xs sm:text-sm'>$ cat {location}_beer_taps.txt</div>
        <div className='pl-2 border-l-2 border-green-700 text-xs sm:text-sm leading-relaxed'>
          {count === 0
            ? `No beer taps currently available at ${location.toUpperCase()}.`
            : `Found ${count} beer tap${count === 1 ? '' : 's'} at ${location.toUpperCase()} location.<br/>Ready for crypto payment transactions.`}
        </div>
      </div>
    </div>
  );
}
