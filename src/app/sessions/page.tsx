import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import SessionList from '../../components/SessionList';
import { getSessions } from '@/lib/actions/sessions';
import { SESSIONS_QUERY_KEY } from '@/lib/constants';

export default async function Sessions() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [SESSIONS_QUERY_KEY],
    queryFn: () => getSessions(),
  });

  return (
    <main className="flex flex-col gap-4 grow items-stretch justify-start w-3xl pt-[25vh]">
      <h1 className="text-xl text-neutral-700 dark:text-neutral-300 text-center sr-only">
        Sessions
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SessionList />
      </HydrationBoundary>
    </main>
  );
}
