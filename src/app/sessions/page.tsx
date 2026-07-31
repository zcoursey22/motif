import { getSessions } from '@/lib/queries/sessions';
import SessionList from '../../components/SessionList';

export default async function Sessions() {
  const sessions = await getSessions();

  return (
    <main className="flex flex-col gap-4 grow items-stretch justify-start w-3xl pt-[25vh]">
      <h1 className="text-xl text-neutral-700 dark:text-neutral-300 text-center sr-only">
        Sessions
      </h1>
      <SessionList sessions={sessions} />
    </main>
  );
}
