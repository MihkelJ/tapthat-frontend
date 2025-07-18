import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className='min-h-screen bg-black text-green-400 font-mono'>
      <div className='container mx-auto px-4 py-8'>
          
          {/* Terminal Header */}
          <div className='w-full mb-4'>
            <div className='text-green-300 text-xs sm:text-sm mb-2'>
              $ ssh user@tapthat.terminal
            </div>
            <div className='text-green-500 text-xs sm:text-sm mb-4'>
              Connection established...
            </div>
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
          
          {/* System Info */}
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
          </div>

          {/* Terminal Description */}
          <div className='mb-6 text-green-400 w-full'>
            <div className='text-green-300 mb-2 text-xs sm:text-sm'>$ cat README.txt</div>
            <div className='pl-2 border-l-2 border-green-700 text-xs sm:text-sm leading-relaxed'>
              Revolutionary self-service beer dispensing system.<br/>
                              Select beer. Connect wallet. Pay. Pour beer.<br/>
                              Onchain payments only. No credit cards.
            </div>
          </div>

          {/* Commands Menu */}
          <div className='w-full'>
            <div className='text-green-300 mb-4 text-xs sm:text-sm'>Available commands:</div>
            <div className='space-y-4 max-w-full sm:max-w-md'>
            
            <Link to='/location/$location' params={{ location: 'demo' }}>
              <div className='mb-4 hover:bg-green-900/20 p-3 rounded border border-green-700 hover:border-green-500 transition-colors cursor-pointer'>
                <div className='text-xs sm:text-sm'>
                  <span className='text-green-400'>$</span> <span className='text-white'>view_locations</span>
                </div>
                <div className='text-xs text-green-600 ml-2 sm:ml-4 mt-1'>Access available tap locations</div>
              </div>
            </Link>
            
            <div className='hover:bg-green-900/20 p-3 rounded border border-green-700 hover:border-green-500 transition-colors cursor-pointer'>
              <div className='text-xs sm:text-sm'>
                <span className='text-green-400'>$</span> <span className='text-white'>system_info</span>
              </div>
              <div className='text-xs text-green-600 ml-2 sm:ml-4 mt-1'>Hackable self-service tap protocol</div>
            </div>
            
            <div className='text-purple-400 text-xs mt-2'>powered by yodl</div>
            
            </div>
          </div>



      </div>
    </div>
  );
}
