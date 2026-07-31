import { Disc3 } from 'lucide-react';
import NewSessionButton from './NewSessionButton';
import { getSessions } from '@/lib/queries/sessions';

type Props = { sessions: Awaited<ReturnType<typeof getSessions>> };

export default async function SessionList({ sessions }: Props) {
  if (!sessions)
    return (
      <div className="inline-flex justify-center gap-2 text-indigo-400 dark:text-indigo-300">
        <Disc3 size={64} strokeWidth={1} className="animate-spin" aria-hidden />
      </div>
    );

  if (!sessions.length) {
    return (
      <div className="flex flex-col items-center gap-4">
        <span className="text-neutral-500 dark:text-neutral-400">
          No sessions logged yet.
        </span>
        <div className="flex justify-center">
          <NewSessionButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-end">
        <NewSessionButton />
      </div>
      <ul className="flex flex-col gap-4">
        {sessions.map(({ id, rawText, occurredOn }) => (
          <li
            className="flex flex-col bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 rounded-3xl shadow-sm"
            key={id}
          >
            {/* <div className="p-4 pb-2 border-b-2 border-neutral-300 dark:border-neutral-700 flex flex-col"> */}
            <div className="p-4 flex flex-col">
              <span>{occurredOn}</span>
              <span>{`"${rawText}"`}</span>
            </div>
            {/* <div className="p-4 pt-2 flex flex-col">
              {entries.map(e => (
                <div key={e}>{e}</div>
              ))}
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
