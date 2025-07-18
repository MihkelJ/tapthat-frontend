export function TerminalHeader() {
  return (
    <div className='w-full mb-4'>
      <div className='text-green-300 text-xs sm:text-sm mb-2'>$ ssh user@tapthat.terminal</div>
      <div className='text-green-500 text-xs sm:text-sm mb-4'>Connection established...</div>
    </div>
  );
}