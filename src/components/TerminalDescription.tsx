export function TerminalDescription() {
  return (
    <div className='mb-6 text-green-400 w-full'>
      <div className='text-green-300 mb-2 text-xs sm:text-sm'>$ cat README.txt</div>
      <div className='pl-2 border-l-2 border-green-700 text-xs sm:text-sm leading-relaxed'>
        Revolutionary self-service beer dispensing system.
        <br />
        Select beer. Connect wallet. Pay. Pour beer.
        <br />
        Onchain payments only. No credit cards.
      </div>
    </div>
  );
}