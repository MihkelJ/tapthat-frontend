import { useEffect, useState } from 'react';

interface TerminalHeaderProps {
  isLoading?: boolean;
}

export function TerminalHeader({ isLoading = false }: TerminalHeaderProps) {
  const [loadingText, setLoadingText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setLoadingText('');
      return;
    }

    const messages = [
      'Connecting to beer taps...',
      'Authenticating with brewery database...',
      'Loading fresh beer data...',
      'Syncing with tap sensors...',
      'Fetching beer availability...'
    ];

    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      const currentMessage = messages[messageIndex];
      
      if (!isDeleting) {
        if (charIndex < currentMessage.length) {
          setLoadingText(currentMessage.substring(0, charIndex + 1));
          charIndex++;
          setTimeout(typeEffect, 50 + Math.random() * 50);
        } else {
          setTimeout(() => {
            isDeleting = true;
            typeEffect();
          }, 1500);
        }
      } else {
        if (charIndex > 0) {
          setLoadingText(currentMessage.substring(0, charIndex - 1));
          charIndex--;
          setTimeout(typeEffect, 30);
        } else {
          isDeleting = false;
          messageIndex = (messageIndex + 1) % messages.length;
          setTimeout(typeEffect, 200);
        }
      }
    };

    typeEffect();

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(cursorInterval);
    };
  }, [isLoading]);

  return (
    <div className='w-full mb-4'>
      <div className='text-green-300 text-xs sm:text-sm mb-2'>$ ssh user@tapthat.terminal</div>
      <div className='text-green-500 text-xs sm:text-sm mb-4'>
        {isLoading ? (
          <>
            {loadingText}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
          </>
        ) : (
          'Connection established...'
        )}
      </div>
    </div>
  );
}