import { Entry, SessionWithEntries } from './schemas/session';
import { toLocalDateString, parseLocalDate } from './utils/date';
import { Focus, Instrument, isStyle, RATING_ORDER } from './constants';
import { EntryWithDate } from './utils/session';

export type TimeBucket = 'day' | 'week' | 'month' | 'year';

function bucketKey(occurredOn: string, bucket: TimeBucket): string {
  if (bucket === 'day') return occurredOn;
  const date = parseLocalDate(occurredOn);
  if (bucket === 'week') {
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  } else if (bucket === 'month') {
    date.setDate(1);
  } else {
    date.setMonth(0, 1);
  }
  return toLocalDateString(date);
}

function startOfBucket(date: Date, bucket: TimeBucket): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (bucket === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  else if (bucket === 'month') d.setDate(1);
  else if (bucket === 'year') d.setMonth(0, 1);
  return d;
}

function advanceBucket(date: Date, bucket: TimeBucket): void {
  if (bucket === 'day') date.setDate(date.getDate() + 1);
  else if (bucket === 'week') date.setDate(date.getDate() + 7);
  else if (bucket === 'month') date.setMonth(date.getMonth() + 1);
  else date.setFullYear(date.getFullYear() + 1);
}

export type ActivityPoint = {
  date: string;
  sessions: number;
  entries: number;
  minutes: number;
};

export function activityTrend(
  sessions: SessionWithEntries[],
  entries: EntryWithDate[],
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
    if (point) point.sessions += 1;
  }

  for (const e of entries) {
    const point = byBucket.get(bucketKey(e.occurredOn, bucket));
    if (!point) continue;
    point.entries += 1;
    point.minutes += e.durationMin ?? 0;
  }

  return [...byBucket.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export type Ranked<T> = { key: T; count: number };

export function topInstruments(
  entries: Entry[],
  limit?: number
): Ranked<Instrument>[] {
  const counts = new Map<Instrument, number>();
  for (const e of entries) {
    if (!e.instrument) continue;
    counts.set(e.instrument, (counts.get(e.instrument) ?? 0) + 1);
  }
  return rankTop(counts, limit || Infinity);
}

export function topFocuses(
  entries: Entry[],
  limit?: number,
  filter?: 'style' | 'activity'
): Ranked<Focus>[] {
  const counts = new Map<Focus, number>();
  for (const e of entries) {
    for (const f of e.focus) {
      if (filter === 'style' && !isStyle(f)) continue;
      if (filter === 'activity' && isStyle(f)) continue;
      counts.set(f, (counts.get(f) ?? 0) + 1);
    }
  }
  return rankTop(counts, limit || Infinity);
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
  cutoff.setDate(cutoff.getDate() - (window - 1));

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

export type RatingPoint = {
  date: string;
  avg: number | null;
  count: number;
};

export function ratingTrend(
  entries: EntryWithDate[],
  bucket: TimeBucket,
  start: Date,
  end: Date = new Date()
): RatingPoint[] {
  const acc = new Map<string, { sum: number; count: number }>();

  const cursor = startOfBucket(start, bucket);
  const last = startOfBucket(end, bucket);
  while (cursor <= last) {
    acc.set(toLocalDateString(cursor), { sum: 0, count: 0 });
    advanceBucket(cursor, bucket);
  }

  for (const e of entries) {
    if (e.selfRating == null) continue;
    const slot = acc.get(bucketKey(e.occurredOn, bucket));
    if (!slot) continue;
    const idx = RATING_ORDER.indexOf(e.selfRating);
    if (idx < 0) continue;
    slot.sum += idx;
    slot.count += 1;
  }

  return [...acc.entries()]
    .map(([date, { sum, count }]) => ({
      date,
      avg: count > 0 ? sum / count : null,
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
