import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-black border-b border-green-500'>
      <div className='container mx-auto px-2 sm:px-4 py-1 sm:py-2'>
        <nav className='flex items-center justify-between'>
          <Link to='/' className='font-mono text-green-500 hover:text-green-400 transition-colors text-xs sm:text-sm'>
            [root@tapthat ~]$ cd /
          </Link>
          <div className='font-mono text-green-500 text-xs'>
            <span className='hidden sm:inline'>{new Date().toLocaleTimeString()} | </span>
            <span>CONN: ACTIVE</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
