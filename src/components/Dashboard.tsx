'use client';

import { useSessions } from '@/hooks/useSessions';
import { Focus, Instrument } from '@/lib/constants';
import { AppError, getErrorMessage } from '@/lib/utils/api';
import { CircleAlert, Disc3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import NewSessionButton from './NewSessionButton';
import { filterSessions } from '@/lib/utils/session';

export default function Dashboard() {
  const { data: sessions, isLoading, isError, error } = useSessions();

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [focuses, setFocuses] = useState<Focus[]>([]);

  const filtered = useMemo(
    () =>
      sessions
        ? filterSessions(sessions, {
            instruments,
            focuses,
          })
        : [],
    [sessions, instruments, focuses]
  );

  if (isError)
    return (
      <div
        className={`text-red-500 dark:text-red-400 inline-flex justify-center items-center gap-2 pt-4`}
      >
        <CircleAlert />
        <span className="text-neutral-600 dark:text-neutral-300">
          {getErrorMessage((error as AppError).code)}
        </span>
      </div>
    );

  if (isLoading)
    return (
      <div className="inline-flex justify-center gap-2 text-indigo-400 dark:text-indigo-300 pt-4">
        <Disc3 size={64} strokeWidth={1} className="animate-spin" aria-hidden />
      </div>
    );

  if (!sessions?.length) {
    return (
      <div className="flex flex-col items-center gap-4 pt-4">
        <span className="text-neutral-500 dark:text-neutral-400">
          No sessions logged yet.
        </span>
        <div className="flex justify-center">
          <NewSessionButton />
        </div>
      </div>
    );
  }

  return <div className="pt-4" />;
}
