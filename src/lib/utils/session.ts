import { Focus, Instrument } from '../constants';
import { Entry, SessionWithEntries } from '../schemas/session';
import { onOrAfter } from './date';

export type EntryWithDate = Entry & { occurredOn: string };

export function filterSessions(
  sessions: SessionWithEntries[],
  {
    search,
    instruments,
    focuses,
    start,
  }: {
    search?: string;
    instruments: Instrument[];
    focuses: Focus[];
    start?: Date;
  }
): SessionWithEntries[] {
  return sessions.filter(s => {
    if (!onOrAfter(s.occurredOn, start)) return false;
    if (search && !s.rawText.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (
      instruments.length &&
      !s.entries.some(e => e.instrument && instruments.includes(e.instrument))
    )
      return false;
    if (
      focuses.length &&
      !s.entries.some(e => e.focus.some(f => focuses.includes(f)))
    )
      return false;
    return true;
  });
}

export function filterEntries(
  sessions: SessionWithEntries[],
  {
    instruments,
    focuses,
    start,
  }: { instruments: Instrument[]; focuses: Focus[]; start?: Date }
): EntryWithDate[] {
  const result: EntryWithDate[] = [];

  for (const s of sessions) {
    if (!onOrAfter(s.occurredOn, start)) continue;
    for (const e of s.entries) {
      if (
        instruments.length &&
        !(e.instrument && instruments.includes(e.instrument))
      )
        continue;
      if (focuses.length && !e.focus.some(f => focuses.includes(f))) continue;
      result.push({ ...e, occurredOn: s.occurredOn });
    }
  }

  return result;
}
