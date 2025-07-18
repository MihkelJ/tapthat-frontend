import { useEffect, useState } from 'react';

interface ASCIIBeerAnimationProps {
  onComplete?: () => void;
}

const beerFrames = [
  // Frame 1 - Normal
  `  ░░░░░
 ███████
 █████ █
 █████ █
 █████ █
 ██████
 █████`,

  // Frame 2 - Tilted right
  `  ▒▒▒▒▒
 ███████
 ██ ████
 ██ ████
 ██ ████
 ██████
 █████`,

  // Frame 3 - More tilted
  `  ▓▓▓▓▓
 ███████
 ████ ██
 ████ ██
 ████ ██
 ██████
 █████`,

  // Frame 4 - Tilted left
  `  ▒▒▒▒▒
 ███████
 █ █████
 █ █████
 █ █████
 ██████
 █████`,
];

export default function ASCIIBeerAnimation({ onComplete }: ASCIIBeerAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    // Animation interval - cycle through frames continuously
    const frameInterval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % beerFrames.length);
    }, 300);

    // Only cleanup interval when component unmounts
    return () => {
      clearInterval(frameInterval);
    };
  }, []);

  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center p-4 font-mono border-2 border-green-700 bg-black'>
      {/* Terminal status */}
      <div className='mb-4 text-green-300 text-xs sm:text-sm text-center'>
        <div className='mb-2'>$ processing_payment...</div>
        <div className='text-green-400'>⚡ Connecting to tap system</div>
      </div>

      {/* Rotating ASCII beer mug */}
      <div className='text-green-400 text-center leading-tight'>
        <pre className='text-sm sm:text-base'>{beerFrames[currentFrame]}</pre>
      </div>

      {/* Loading indicator */}
      <div className='mt-4 text-green-300 text-xs text-center'>
        <div>getting ready to tap_that...</div>
        <div className='mt-2 flex justify-center'>
          <span className='animate-pulse'>{'█'.repeat((currentFrame % 4) + 1)}</span>
          <span className='text-green-700'>{'█'.repeat(4 - (currentFrame % 4))}</span>
        </div>
      </div>
    </div>
  );
}
