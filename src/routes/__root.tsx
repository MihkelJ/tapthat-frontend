import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { VerificationModal } from '@/components/VerificationModal';
import { useVerification } from '@/providers/VerificationProvider';
import Header from '../components/Header';

function RootComponent() {
  const { currentVerifyingTap } = useVerification();

  return (
    <div className='min-h-screen'>
      <Header />

      <main className='pt-16'>
        <Outlet />
      </main>

      {currentVerifyingTap && <VerificationModal tapId={currentVerifyingTap} tapTitle={`Tap ${currentVerifyingTap}`} />}

      <ReactQueryDevtools buttonPosition='top-right' />
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
