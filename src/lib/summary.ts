import { SessionWithEntries } from './schemas/session';
import { toLocalDateString, parseLocalDate } from './utils/date';
import { Focus, Instrument, isStyle } from './constants';

export type TimeBucket = 'day' | 'week' | 'month' | 'year';

function bucketKey(occurredOn: string, bucket: TimeBucket): string {
  if (bucket === 'day') return occurredOn;
  const date = parseLocalDate(occurredOn);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return toLocalDateString(date);
}

function startOfBucket(date: Date, bucket: TimeBucket): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (bucket === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function advanceBucket(date: Date, bucket: TimeBucket): void {
  date.setDate(date.getDate() + (bucket === 'day' ? 1 : 7));
}

export type ActivityPoint = {
  date: string;
  sessions: number;
  entries: number;
  minutes: number;
};

export function activityTrend(
  sessions: SessionWithEntries[],
  bucket: TimeBucket,
  start: Date,
  end: Date = new Date()
): ActivityPoint[] {
  const byBucket = new Map<string, ActivityPoint>();

  const cursor = startOfBucket(start, bucket);
  const last = startOfBucket(end, bucket);
  while (cursor <= last) {
    const key = toLocalDateString(cursor);
    byBucket.set(key, { date: key, sessions: 0, entries: 0, minutes: 0 });
    advanceBucket(cursor, bucket);
  }

  for (const s of sessions) {
    const point = byBucket.get(bucketKey(s.occurredOn, bucket));
    if (!point) continue;
    point.sessions += 1;
    point.entries += s.entries.length;
    point.minutes += s.entries.reduce(
      (sum, e) => sum + (e.durationMin ?? 0),
      0
    );
  }

  return [...byBucket.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export type Ranked<T> = { key: T; count: number };

export function topInstruments(
  sessions: SessionWithEntries[],
  limit = 3
): Ranked<Instrument>[] {
  const counts = new Map<Instrument, number>();
  for (const s of sessions) {
    for (const e of s.entries) {
      if (!e.instrument) continue;
      counts.set(e.instrument, (counts.get(e.instrument) ?? 0) + 1);
    }
  }
  return rankTop(counts, limit);
}

export function topFocuses(
  sessions: SessionWithEntries[],
  limit = 3,
  filter?: 'style' | 'activity'
): Ranked<Focus>[] {
  const counts = new Map<Focus, number>();
  for (const s of sessions) {
    for (const e of s.entries) {
      for (const f of e.focus) {
        if (filter === 'style' && !isStyle(f)) continue;
        if (filter === 'activity' && isStyle(f)) continue;
        counts.set(f, (counts.get(f) ?? 0) + 1);
      }
    }
  }
  return rankTop(counts, limit);
}

function rankTop<T>(counts: Map<T, number>, limit: number): Ranked<T>[] {
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type Consistency = { daysPracticed: number; window: number };

export function consistency(
  sessions: SessionWithEntries[],
  window = 14,
  asOf: Date = new Date()
): Consistency {
  const cutoff = new Date(asOf);
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (window - 1)); // inclusive window

  const days = new Set<string>();
  for (const s of sessions) {
    const d = parseLocalDate(s.occurredOn);
    if (d >= cutoff && d <= asOf) days.add(s.occurredOn);
  }
  return { daysPracticed: days.size, window };
}

// Monday of the given date's week
function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export function weeklyStreak(
  sessions: SessionWithEntries[],
  asOf: Date = new Date()
): number {
  const weeks = new Set<string>();
  for (const s of sessions) {
    weeks.add(toLocalDateString(mondayOf(parseLocalDate(s.occurredOn))));
  }

  const cursor = mondayOf(asOf);
  if (!weeks.has(toLocalDateString(cursor))) {
    cursor.setDate(cursor.getDate() - 7);
  }

  let streak = 0;
  while (weeks.has(toLocalDateString(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}
