'use client';

import { Disc3 } from 'lucide-react';
import NewSessionButton from './NewSessionButton';
import SessionCard from './SessionCard';
import { useSessions } from '@/hooks/useSessions';

export default function SessionList() {
  const { data: sessions, isLoading, isError } = useSessions();

  if (isError) return <div>An error occurred.</div>;

  if (isLoading) return <div>Loading...</div>;

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
        {sessions.map(session => (
          <li key={session.id}>
            <SessionCard session={session} />
          </li>
        ))}
      </ul>
    </div>
  );
}
