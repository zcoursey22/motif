'use client';

import { Session } from '@/lib/schemas/session';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function SessionList() {
  const router = useRouter();

  const sessions: Session[] = [
    {
      id: crypto.randomUUID(),
      rawText: 'ffdsfdsf ddsfdsdss fdsfdsfdsfsd fds.',
      occurredOn: '2026-5-13',
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      rawText: 'fdsf dsgf dsaf dsfds fds fds fds gsre gsad fgef esds.',
      occurredOn: '2026-5-17',
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      rawText: 'dsf dsf dsf dsf ds qaa a.',
      occurredOn: '2026-5-12',
      createdAt: new Date(),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-end">
        <Button
          color="brand"
          icon={Plus}
          onClick={() => router.push('/sessions')}
        >
          New session
        </Button>
      </div>
      <ul className="flex flex-col gap-4">
        {sessions.map(({ id, rawText, occurredOn }) => (
          <li
            className="flex flex-col gap-2 p-4 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 rounded-3xl shadow-sm"
            key={id}
          >
            <span>{occurredOn}</span>
            <span>{rawText}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
