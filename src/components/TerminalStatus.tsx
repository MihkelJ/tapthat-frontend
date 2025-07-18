interface TerminalStatusProps {
  location: string;
  count: number;
}

export default function TerminalStatus({ location, count }: TerminalStatusProps) {
  return (
    <div className='mb-8 w-full'>
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
    </div>
  );
}
