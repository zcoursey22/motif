'use client';

import { Activity, Disc3, Plus, SkipBack, SkipForward, X } from 'lucide-react';
import { useReducer, useRef, useState } from 'react';
import { useParse } from '../hooks/useParse';
import { ParsedEntry } from '@/lib/schemas/parse';
import { SelfRating } from '@/lib/constants';

type EditableParsedEntryRow = ParsedEntry & { tempId: string };

enum RowActionType {
  SET,
  UPDATE,
  DELETE,
  ADD,
}

type RowAction =
  | { type: RowActionType.SET; rows: EditableParsedEntryRow[] }
  | { type: RowActionType.UPDATE; tempId: string; patch: Partial<ParsedEntry> }
  | { type: RowActionType.DELETE; tempId: string }
  | { type: RowActionType.ADD };

const getEmptyRow = (): EditableParsedEntryRow => ({
  tempId: crypto.randomUUID(),
  instrument: null,
  focus: [],
  selfRating: null,
  durationMin: null,
});

const rowReducer = (
  state: EditableParsedEntryRow[],
  action: RowAction
): EditableParsedEntryRow[] => {
  switch (action.type) {
    case RowActionType.SET:
      return action.rows.length ? action.rows : [getEmptyRow()];
    case RowActionType.UPDATE:
      return state.map(r =>
        r.tempId === action.tempId ? { ...r, ...action.patch } : r
      );
    case RowActionType.DELETE:
      return state.length <= 1
        ? state
        : state.filter(r => r.tempId !== action.tempId);
    case RowActionType.ADD:
      return [...state, getEmptyRow()];
  }
};

export default function CaptureForm() {
  const [rawText, setRawText] = useState('');
  const rawTextElement = useRef<HTMLTextAreaElement>(null);

  const [rows, dispatchRows] = useReducer(rowReducer, null, () => [
    getEmptyRow(),
  ]);

  const { mutate, isSuccess, isPending, isError, error, reset } = useParse();

  const trimmedLength = rawText.trim().length;
  const rawTextHasValue = trimmedLength > 0 && trimmedLength <= 500;

  const isRawTextAreaLocked = isPending || isSuccess;

  const handleParse = () => {
    if (!rawTextHasValue || isRawTextAreaLocked) return;
    const trimmed = rawText.trim();
    setRawText(trimmed);
    rawTextElement.current?.blur();
    mutate(trimmed, {
      onSuccess: parsed => {
        dispatchRows({
          type: RowActionType.SET,
          rows: parsed.map(p => ({ ...p, tempId: crypto.randomUUID() })),
        });
      },
      onError: () => rawTextElement.current?.focus(),
    });
  };

  const handleBack = () => {
    dispatchRows({ type: RowActionType.SET, rows: [] });
    reset();
    rawTextElement.current?.focus();
  };

  const handleSubmit = () => {
    setRawText('');
    dispatchRows({ type: RowActionType.SET, rows: [] });
    reset();
    rawTextElement.current?.focus();
  };

  const handleTextAreaContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) rawTextElement.current?.focus();
    // TODO: Why does clicking/holding outside of textarea temporarily blur the focus?
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    handleParse();
  };

  return (
    <>
      <div
        onClick={handleTextAreaContainerClick}
        className={`flex flex-col gap-2 justify-center items-stretch w-2xl max-w-[100%] p-4 pt-6 pr-3 mb-1 rounded-3xl cursor-text ${
          isRawTextAreaLocked
            ? 'bg-neutral-200 dark:bg-neutral-700'
            : 'bg-white dark:bg-neutral-900 shadow-sm focus-within:shadow-lg'
        }`}
      >
        <textarea
          className="focus:outline-hidden resize-none pl-2 field-sizing-content max-h-42 overflow-y-auto scrollbar-thin scrollbar-gutter-stable placeholder-neutral-400 dark:placeholder-neutral-400 read-only:text-neutral-500 read-only:dark:text-neutral-400"
          placeholder="How did it go?"
          onChange={e => setRawText(e.currentTarget.value)}
          value={rawText}
          onKeyDown={handleKeyDown}
          autoFocus
          readOnly={isRawTextAreaLocked}
          ref={rawTextElement}
          autoComplete="off"
        />
        <div
          className={`flex justify-between items-end pr-1 pointer-events-none
          ${isRawTextAreaLocked ? '' : 'min-h-9'}`}
        >
          <span
            className={`pl-2 text-sm ${
              isRawTextAreaLocked ? 'hidden' : ''
            } ${trimmedLength > 500 ? 'text-red-600 dark:text-red-600' : 'text-neutral-400 dark:text-neutral-400'}`}
          >
            {`${trimmedLength} / 500`}
          </span>
          <button
            className={`items-center gap-2 bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 hover:bg-blue-400 dark:hover:bg-blue-400 aria-disabled:bg-slate-300 dark:aria-disabled:bg-slate-500 text-white aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400 px-4 py-2 rounded-xl cursor-pointer aria-disabled:cursor-text pointer-events-auto ${
              isRawTextAreaLocked ? 'hidden' : 'inline-flex'
            }`}
            aria-disabled={!rawTextHasValue || isRawTextAreaLocked}
            onClick={handleParse}
            aria-label="Parse your practice session summary"
          >
            Parse
            <SkipForward size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
      {isPending && (
        <div className="inline-flex justify-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Disc3
            size={64}
            strokeWidth={1}
            className="animate-spin"
            aria-label="Loading"
          />
        </div>
      )}
      {!isPending && isError && (
        <span className="text-red-500 dark:text-red-400">
          Error: {error.message}
        </span>
      )}
      {!isPending && !isError && isSuccess && (
        <div className="flex flex-col w-2xl max-w-[100%] mb-4">
          <div className="flex items-center justify-end gap-4 pb-2">
            <button
              className="min-h-[40px] min-w-[40px] justify-center self-stretch inline-flex items-center gap-2 hover:text-white hover:bg-neutral-400 dark:hover:bg-neutral-500 aria-disabled:hover:text-neutral-300 aria-disabled:text-neutral-300 aria-disabled:hover:bg-transparent aria-disabled:dark:text-neutral-600 dark:aria-disabled:hover:text-neutral-600 aria-disabled:dark:hover:bg-transparent px-4 py-2 rounded-xl cursor-pointer aria-disabled:cursor-default pointer-events-auto"
              onClick={handleBack}
              aria-label="Back"
            >
              <SkipBack size={18} strokeWidth={2} />
              Back
            </button>
            <div className="flex gap-2 items-center justify-end grow">
              <span className="text-neutral-500 dark:text-neutral-400">
                Practiced on
              </span>
              <input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className="bg-white dark:bg-neutral-900 shadow-sm focus-within:shadow-lg rounded-2xl px-4 py-2 focus:outline-none"
              />
            </div>
            <button
              className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 aria-disabled:bg-mist-300 dark:aria-disabled:bg-mist-500 text-white aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400 px-4 py-2 rounded-xl cursor-pointer aria-disabled:cursor-default pointer-events-auto"
              aria-disabled={!rows?.length}
              onClick={handleSubmit}
              aria-label="Log session"
            >
              Log
              <Activity size={18} strokeWidth={2} />
            </button>
          </div>
          <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,2fr)_minmax(0,2fr)_auto] mb-2 border-b-2 border-neutral-300 dark:border-neutral-700">
            <div className="grid grid-cols-subgrid col-span-5 gap-2 py-2 text-neutral-500 dark:text-neutral-400">
              <span>Instrument</span>
              <span>Focus</span>
              <span>Rating</span>
              <span>Duration</span>
              <span />
            </div>
            {rows.map(row => (
              <div
                key={row.tempId}
                className="grid grid-cols-subgrid col-span-5 gap-2 items-stretch py-2 border-t-2 border-neutral-300 dark:border-neutral-700"
              >
                <input
                  type="text"
                  value={row.instrument ?? ''}
                  onChange={e =>
                    dispatchRows({
                      type: RowActionType.UPDATE,
                      tempId: row.tempId,
                      patch: { instrument: e.target.value.trim() || null },
                    })
                  }
                  className="bg-white dark:bg-neutral-900 shadow-sm focus:shadow-lg rounded-2xl px-4 py-2 focus:outline-none"
                />
                <input
                  type="text"
                  value={row.focus?.join(', ') ?? ''}
                  onChange={e => {}}
                  className="bg-white dark:bg-neutral-900 shadow-sm focus:shadow-lg rounded-2xl px-4 py-2 focus:outline-none"
                />
                <select
                  value={row.selfRating ?? ''}
                  onChange={e =>
                    dispatchRows({
                      type: RowActionType.UPDATE,
                      tempId: row.tempId,
                      patch: {
                        selfRating:
                          e.target.value === ''
                            ? null
                            : (e.target.value as SelfRating),
                      },
                    })
                  }
                  className="bg-white dark:bg-neutral-900 shadow-sm focus:shadow-lg rounded-2xl px-4 py-2 focus:outline-none"
                >
                  <option value="" />
                  {Object.values(SelfRating).map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={row.durationMin ?? ''}
                  onChange={e => {
                    const n =
                      e.target.value === '' ? null : Number(e.target.value);
                    dispatchRows({
                      type: RowActionType.UPDATE,
                      tempId: row.tempId,
                      patch: { durationMin: Number.isFinite(n) ? n : null },
                    });
                  }}
                  className="bg-white dark:bg-neutral-900 shadow-sm focus:shadow-lg rounded-2xl px-4 py-2 focus:outline-none"
                />
                <button
                  className="min-h-[40px] min-w-[40px] self-center inline-flex justify-center items-center gap-2 hover:text-white text-red-500 hover:bg-red-500 dark:text-red-400 dark:hover:bg-red-400 aria-disabled:hover:text-mauve-300 aria-disabled:text-mauve-300 aria-disabled:hover:bg-transparent aria-disabled:dark:text-mauve-500 dark:aria-disabled:hover:text-mauve-500 aria-disabled:dark:hover:bg-transparent p-2 rounded-xl cursor-pointer aria-disabled:cursor-default pointer-events-auto"
                  onClick={() =>
                    dispatchRows({
                      type: RowActionType.DELETE,
                      tempId: row.tempId,
                    })
                  }
                  aria-label="Delete parsed entry row"
                  aria-disabled={rows.length <= 1}
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
          <button
            className="min-h-[40px] min-w-[40px] justify-center self-stretch inline-flex items-center gap-2 hover:text-white hover:bg-neutral-400 dark:hover:bg-neutral-500 aria-disabled:hover:text-neutral-300 aria-disabled:text-neutral-300 aria-disabled:hover:bg-transparent aria-disabled:dark:text-neutral-600 dark:aria-disabled:hover:text-neutral-600 aria-disabled:dark:hover:bg-transparent p-2 rounded-xl cursor-pointer aria-disabled:cursor-default pointer-events-auto"
            onClick={() => {
              if (rows.length < 10)
                dispatchRows({
                  type: RowActionType.ADD,
                });
            }}
            aria-label="Delete parsed entry row"
            aria-disabled={rows.length >= 10}
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </div>
      )}
    </>
  );
}
