import { Focus, Instrument } from '../constants';
import { SessionWithEntries } from '../schemas/session';

export function filterSessions(
  sessions: SessionWithEntries[],
  {
    search,
    instruments,
    focuses,
  }: { search?: string; instruments: Instrument[]; focuses: Focus[] }
): SessionWithEntries[] {
  return sessions.filter(s => {
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
