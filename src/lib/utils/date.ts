export function toLocalDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseLocalDate(s: string): Date {
  const [year, month, day] = s.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function onOrAfter(occurredOn: string, start?: Date): boolean {
  if (!start) return true;
  return parseLocalDate(occurredOn) >= start;
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;
export const getLocalWeekday = (d: Date): string =>
  WEEKDAYS[(d.getDay() + 6) % 7]; // Week starts on Monday

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export const DATE_RANGE_PRESETS = {
  '7d': { label: 'Last 7 days', start: () => daysAgo(7) },
  '30d': { label: 'Last 30 days', start: () => daysAgo(30) },
  '90d': { label: 'Last 90 days', start: () => daysAgo(90) },
  all: { label: 'All time', start: () => undefined },
} as const;
