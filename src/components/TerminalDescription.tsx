import type { ReactNode } from "react";

interface TerminalDescriptionProps {
  command?: string;
  children?: ReactNode;
}

export function TerminalDescription({ 
  command = "cat README.txt", 
  children 
}: TerminalDescriptionProps) {
  const defaultContent = (
    <>
      Revolutionary self-service beer dispensing system.
      <br />
      Select beer. Connect wallet. Pay. Pour beer.
      <br />
      Onchain payments only. No credit cards.
    </>
  );

  return (
    <div className='mb-6 text-green-400 w-full'>
      <div className='text-green-300 mb-2 text-xs sm:text-sm'>$ {command}</div>
      <div className='pl-2 border-l-2 border-green-700 text-xs sm:text-sm leading-relaxed'>
        {children || defaultContent}
      </div>
    </div>
  );
}