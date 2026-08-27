'use client';

import { ArrowDown, CircleAlert, Disc3, Search, X } from 'lucide-react';
import NewSessionButton from './NewSessionButton';
import SessionCard from './SessionCard';
import { useSessions } from '@/hooks/useSessions';
import { AppError, getErrorMessage } from '@/lib/utils/api';
import { useMemo, useRef, useState } from 'react';
import {
  Focus,
  FOCUS_GROUPS,
  FOCUS_LABELS,
  Instrument,
  INSTRUMENT_GROUPS,
  INSTRUMENT_LABELS,
} from '@/lib/constants';
import { Button } from './ui/Button';
import { MultiSelect } from './ui/MultiSelect';
import { filterSessions } from '@/lib/utils/session';

export default function SessionList() {
  const { data: sessions, isLoading, isError, error } = useSessions();

  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [focuses, setFocuses] = useState<Focus[]>([]);
  const [isEditingSession, setIsEditingSession] = useState(false);

  const searchInputElement = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    if (!sessions) return [];
    const filtered = filterSessions(sessions, { search, instruments, focuses });
    return sortAsc ? [...filtered].reverse() : filtered;
  }, [sessions, search, instruments, focuses, sortAsc]);

  const handleSearchInputContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) searchInputElement.current?.focus();
  };

  const resetFilters = () => {
    setSearch('');
    setInstruments([]);
    setFocuses([]);
  };

  if (isError)
    return (
      <div
        className={`text-red-500 dark:text-red-400 inline-flex justify-center items-center gap-2 pt-4`}
      >
        <CircleAlert />
        <span className="text-neutral-600 dark:text-neutral-300">
          {getErrorMessage((error as AppError).code)}
        </span>
      </div>
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
    <div className="flex flex-col gap-3 items-center">
      <div className="w-4xl px-16 sticky top-15 z-10 pt-2 justify-between items-center bg-neutral-200 dark:bg-neutral-800 flex flex-wrap gap-2 items-center pb-4 shadow-lg shadow-neutral-200/100 dark:shadow-neutral-800/100">
        <div className="flex-1 flex justify-start">
          <Button
            icon={ArrowDown}
            variant="ghost"
            onClick={() => setSortAsc(a => !a)}
            className="min-w-27"
            iconClassName={`transition-transform duration-200 ${sortAsc ? 'rotate-180' : ''}`}
          >
            {sortAsc ? 'Oldest' : 'Latest'}
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <div
            onClick={handleSearchInputContainerClick}
            className={`flex gap-2 items-center justify-center shadow-xs focus-within:shadow-md rounded-2xl bg-white dark:bg-black cursor-text has-focus-visible:outline-2 has-focus-visible:outline-blue-500 dark:has-focus-visible:outline-blue-400
              ${isEditingSession ? 'field-busy pointer-events-none' : ''}`}
          >
            <div className="pl-4" onClick={handleSearchInputContainerClick}>
              <Search
                aria-hidden
                size={18}
                strokeWidth={2.5}
                className="text-neutral-400 pointer-events-none"
              />
            </div>
            <input
              className="focus-visible:outline-none w-24"
              onChange={e => {
                if (isEditingSession) return;
                setSearch(e.currentTarget.value);
              }}
              ref={searchInputElement}
              value={search}
              aria-disabled={isEditingSession}
            />
            <button
              type="button"
              onClick={e => {
                if (isEditingSession) return;

                if (search === '') handleSearchInputContainerClick(e);
                else setSearch('');
              }}
              tabIndex={search === '' ? -1 : 0}
              aria-label="Clear search"
              className={`p-2 w-[40px] h-[40px] shrink-0 flex justify-center items-center hover:text-red-500 dark:hover:text-red-400 rounded-xl focus-visible:outline-2 focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400
                ${search !== '' ? 'cursor-pointer' : 'cursor-text'}`}
            >
              {search !== '' && <X aria-hidden size={14} />}
            </button>
          </div>
          <MultiSelect
            value={instruments}
            onChange={setInstruments}
            groups={INSTRUMENT_GROUPS}
            labels={INSTRUMENT_LABELS}
            disabled={isEditingSession}
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
            disabled={isEditingSession}
            variant="pill"
            noun="focuses"
            placeholder="Focus"
            ariaLabel="Filter by focus"
          />
        </div>

        <div className="flex-1 flex justify-end">
          <span className="text-neutral-500 dark:text-neutral-400">
            {visible.length !== sessions.length
              ? `${visible.length} of ${sessions.length}`
              : `${visible.length} sessions`}
          </span>
        </div>
      </div>
      <ul className="flex flex-col gap-4 w-4xl px-16">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-neutral-500 dark:text-neutral-400">
              {"Your current filters didn\'t match any sessions."}
            </span>
            <div className="flex justify-center">
              <Button color="brand" onClick={resetFilters}>
                Reset filters
              </Button>
            </div>
          </div>
        ) : (
          visible.map(session => (
            <li key={session.id}>
              <SessionCard
                session={session}
                isSomeSessionBeingEdited={isEditingSession}
                setIsSomeSessionBeingEdited={setIsEditingSession}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
