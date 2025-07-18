import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Header from '../components/Header';

export const Route = createRootRoute({
  component: () => (
    <div className='min-h-screen'>
      <Header />

      <main className='pt-20'>
        <Outlet />
      </main>

      <ReactQueryDevtools buttonPosition='top-right' />
      <TanStackRouterDevtools />
    </div>
  ),
});
