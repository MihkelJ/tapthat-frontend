export function TapThatLogo({ text }: { text: string }) {
  return (
    <div className='mb-6 text-left w-full'>
      <div className='flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-hidden'>
        <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-green-400 py-4 font-retro flex-shrink'>
          {text}
          <span className='cursor-blink'>_</span>
        </div>
        <div className='flex flex-col items-center flex-shrink-0'>
          <div className='text-green-400 font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl beer-bounce'>
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
  );
}
