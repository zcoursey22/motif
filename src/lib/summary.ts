import { SessionWithEntries } from './schemas/session';
import { toLocalDateString, parseLocalDate } from './utils/date';

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
