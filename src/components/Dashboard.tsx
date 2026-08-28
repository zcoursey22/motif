'use client';

import { useSessions } from '@/hooks/useSessions';
import {
  Focus,
  FOCUS_GROUPS,
  FOCUS_LABELS,
  Instrument,
  INSTRUMENT_GROUPS,
  INSTRUMENT_LABELS,
} from '@/lib/constants';
import { AppError, getErrorMessage } from '@/lib/utils/api';
import { Disc3, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import NewSessionButton from './NewSessionButton';
import { filterEntries, filterSessions } from '@/lib/utils/session';
import { Notice } from './ui/Notice';
import { MultiSelect } from './ui/MultiSelect';
import { Button } from './ui/Button';
import { DATE_RANGE_PRESETS } from '@/lib/utils/date';

const DEFAULT_DATE_RANGE_PRESET = 'all';

export default function Dashboard() {
  const { data: sessions, isLoading, isError, error } = useSessions();

  const [dateRangePreset, setDateRangePreset] = useState<
    keyof typeof DATE_RANGE_PRESETS
  >(DEFAULT_DATE_RANGE_PRESET);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [focuses, setFocuses] = useState<Focus[]>([]);

  const filteredSessions = useMemo(
    () =>
      sessions
        ? filterSessions(sessions, {
            instruments,
            focuses,
            start: DATE_RANGE_PRESETS[dateRangePreset].start(),
          })
        : [],
    [sessions, instruments, focuses, dateRangePreset]
  );
  const filteredEntries = useMemo(
    () =>
      sessions
        ? filterEntries(sessions, {
            instruments,
            focuses,
            start: DATE_RANGE_PRESETS[dateRangePreset].start(),
          })
        : [],
    [sessions, instruments, focuses, dateRangePreset]
  );

  const hasFilters = instruments.length > 0 || focuses.length > 0;

  const resetFilters = () => {
    setInstruments([]);
    setFocuses([]);
  };

  if (isError)
    return (
      <Notice className="pt-4">
        {getErrorMessage((error as AppError).code)}
      </Notice>
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

  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      <div className="flex flex-col gap-3 w-3xl border-b-2 pb-5 border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">
        <div className="flex justify-between">
          <span className="text-left">Insights are based on all data</span>
          <div className="flex gap-6">
            <span>{filteredSessions.length} sessions</span>
            <span>
              {filteredSessions.reduce((n, s) => n + s.entries.length, 0)}{' '}
              entries
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {[1, 2, 3].map(c => (
            <div
              key={c}
              className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-900 px-6 py-4 rounded-2xl shadow-sm"
            >
              <span>Computed insight {c}</span>
              <span>Value</span>
            </div>
          ))}
        </div>
        <div className="flex bg-neutral-100 dark:bg-neutral-900 pr-4 pl-6 py-4 rounded-2xl shadow-sm items-center justify-between border-2 border-indigo-300 dark:border-indigo-700">
          <span>
            Get deeper analysis to see patterns and connections across your
            practice.
          </span>
          <Button icon={Sparkles} color="brand">
            Analyze
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-4xl px-16 sticky top-15 z-10 pt-2 justify-start items-center bg-neutral-200 dark:bg-neutral-800 flex flex-wrap gap-2 items-center pb-4 shadow-lg shadow-neutral-200/100 dark:shadow-neutral-800/100">
          <select
            value={dateRangePreset}
            onChange={e =>
              setDateRangePreset(
                e.target.value as keyof typeof DATE_RANGE_PRESETS
              )
            }
            className="bg-white dark:bg-black shadow-xs focus:shadow-md rounded-2xl px-4 py-2 outline-2 outline-transparent focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400"
            aria-label="Date range"
          >
            {Object.entries(DATE_RANGE_PRESETS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <MultiSelect
            value={instruments}
            onChange={setInstruments}
            groups={INSTRUMENT_GROUPS}
            labels={INSTRUMENT_LABELS}
            variant="pill"
            noun="instruments"
            placeholder="Instruments"
            ariaLabel="Filter by instrument"
          />
          <MultiSelect
            value={focuses}
            onChange={setFocuses}
            groups={FOCUS_GROUPS}
            labels={FOCUS_LABELS}
            variant="pill"
            noun="focuses"
            placeholder="Focus"
            ariaLabel="Filter by focus"
          />
        </div>

        {filteredSessions.length === 0 && filteredEntries.length === 0 ? ( // TODO: This is broken now
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">
              {hasFilters
                ? 'No practice data matches your current filters.'
                : 'No practice data in this date range.'}
            </span>
            {hasFilters && (
              <div className="flex justify-center">
                <Button color="brand" onClick={resetFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-4xl px-16">
            {[1, 2, 3, 4, 5, 6].map(c => (
              <div
                key={c}
                className="h-72 rounded-2xl bg-neutral-100 dark:bg-neutral-900 shadow-sm p-4 text-neutral-500 dark:text-neutral-400"
              >
                <span>Chart {c}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
