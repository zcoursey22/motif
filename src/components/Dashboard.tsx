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
import { DATE_RANGE_PRESETS, parseLocalDate } from '@/lib/utils/date';
import ActivityChart from './dashboard/charts/ActivityChart';
import { TimeBucket } from '@/lib/summary';

function bucketForStart(start: Date): TimeBucket {
  const days = (new Date().getTime() - start.getTime()) / 86_400_000;
  if (days <= 31) return 'day';
  if (days <= 365 / 2) return 'week';
  if (days <= 365 * 2) return 'month';
  return 'year';
}

export default function Dashboard() {
  const { data: sessions, isLoading, isError, error } = useSessions();

  const [dateRangePreset, setDateRangePreset] =
    useState<keyof typeof DATE_RANGE_PRESETS>('all');
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [focuses, setFocuses] = useState<Focus[]>([]);

  const dateRangeStart = useMemo(() => {
    const end = new Date();
    const presetStart = DATE_RANGE_PRESETS[dateRangePreset].start();
    if (presetStart) return presetStart;
    if (!sessions?.length) return end;
    const earliest = sessions.reduce(
      (min, s) => (s.occurredOn < min ? s.occurredOn : min),
      sessions[0].occurredOn
    );
    return parseLocalDate(earliest);
  }, [sessions, dateRangePreset]);

  const bucket = useMemo(
    () => bucketForStart(dateRangeStart),
    [dateRangeStart]
  );

  const filteredSessions = useMemo(
    () =>
      sessions
        ? filterSessions(sessions, {
            instruments,
            focuses,
            start: dateRangeStart,
          })
        : [],
    [sessions, instruments, focuses, dateRangeStart]
  );
  const filteredEntries = useMemo(
    () =>
      sessions
        ? filterEntries(sessions, {
            instruments,
            focuses,
            start: dateRangeStart,
          })
        : [],
    [sessions, instruments, focuses, dateRangeStart]
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
    <div className="flex flex-col items-center gap-6 pt-4">
      <div className="flex flex-col gap-6 w-3xl border-b-2 pb-8 border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">
        <div className="flex justify-between">
          <span className="text-left">Insights are based on all data</span>
          <div className="flex gap-6">
            <span>{sessions.length} sessions</span>
            <span>
              {sessions.reduce((n, s) => n + s.entries.length, 0)} entries
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {[1, 2, 3].map(c => (
            <div
              key={c}
              className="flex flex-col items-center bg-neutral-100 dark:bg-neutral-900 px-6 py-4 rounded-2xl outline-1 outline-neutral-200 dark:outline-neutral-800 shadow-md dark:shadow-md/30"
            >
              <span>Computed insight {c}</span>
              <span>Value</span>
            </div>
          ))}
        </div>
        <div
          className="flex bg-neutral-100 dark:bg-neutral-900 pr-4 pl-6 py-4 rounded-2xl items-center justify-between
          outline-1 outline-neutral-200 dark:outline-neutral-800
          shadow-[0_4px_6px_-1px_rgb(0_0_0_/0.1),0_2px_4px_-2px_rgb(0_0_0_/0.1),0_0_15px_-3px_var(--color-indigo-500),0_0_6px_-4px_var(--color-indigo-500)]
          dark:shadow-[0_4px_6px_-1px_rgb(0_0_0_/0.3),0_2px_4px_-2px_rgb(0_0_0_/0.3),0_0_15px_-3px_var(--color-indigo-400),0_0_6px_-4px_var(--color-indigo-400)]"
        >
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
            className="bg-white dark:bg-black rounded-2xl px-4 py-2 outline-2 outline-transparent focus-visible:outline-neutral-400 dark:focus-visible:outline-neutral-500"
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
            <ActivityChart
              sessions={filteredSessions}
              bucket={bucket}
              start={dateRangeStart}
            />
          </div>
        )}
      </div>
    </div>
  );
}
