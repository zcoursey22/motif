import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getSessions } from '@/lib/actions/sessions';
import { SESSIONS_QUERY_KEY } from '@/lib/constants';
import Dashboard from '@/components/Dashboard';

export default async function Sessions() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [SESSIONS_QUERY_KEY],
    queryFn: () => getSessions(),
  });

  return (
    <main className="flex flex-col gap-4 grow items-stretch justify-start w-4xl pb-8">
      <h1 className="text-xl text-neutral-700 dark:text-neutral-300 text-center sr-only">
        Dashboard
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Dashboard />
      </HydrationBoundary>
    </main>
  );
}
