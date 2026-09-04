import { Entry, SessionWithEntries } from '@/lib/schemas/session';
import {
  topInstruments,
  topFocuses,
  consistency,
  weeklyStreak,
} from '@/lib/summary';
import { INSTRUMENT_LABELS, FOCUS_LABELS } from '@/lib/constants';
import { useMemo } from 'react';
import InsightCard from './InsightCard';

function RankedList<T extends string>({
  items,
  labels,
}: {
  items: { key: T; count: number }[];
  labels: Record<T, string>;
}) {
  if (!items.length) {
    return (
      <span className="text-sm text-neutral-600 dark:text-neutral-300">
        Nothing logged yet.
      </span>
    );
  }
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ key, count }) => (
        <li
          key={key}
          className="flex justify-between text-sm font-medium text-neutral-600 dark:text-neutral-300"
        >
          <span>{labels[key]}</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {count}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TopInstrumentsCard({ entries }: { entries: Entry[] }) {
  const items = useMemo(() => topInstruments(entries, 3), [entries]);
  return (
    <InsightCard title="Top instruments">
      <RankedList items={items} labels={INSTRUMENT_LABELS} />
    </InsightCard>
  );
}

export function TopFocusesCard({ entries }: { entries: Entry[] }) {
  const items = useMemo(() => topFocuses(entries, 3), [entries]);
  return (
    <InsightCard title="Top focus areas">
      <RankedList items={items} labels={FOCUS_LABELS} />
    </InsightCard>
  );
}

export function ConsistencyCard({
  sessions,
}: {
  sessions: SessionWithEntries[];
}) {
  const { daysPracticedWithinWindow, windowDays } = useMemo(
    () => consistency(sessions),
    [sessions]
  );
  const streak = useMemo(() => weeklyStreak(sessions), [sessions]);

  return (
    <InsightCard title="Consistency">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">
            {daysPracticedWithinWindow}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            sessions over last <span className="font-medium">{windowDays}</span>{' '}
            days
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">
            {streak}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            week streak
          </span>
        </div>
      </div>
    </InsightCard>
  );
}
