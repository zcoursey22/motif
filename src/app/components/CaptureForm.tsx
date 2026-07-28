'use client';

import {
  Activity,
  CircleAlert,
  CornerLeftUp,
  Disc3,
  InfoIcon,
  Plus,
  ScanText,
  X,
} from 'lucide-react';
import { useReducer, useRef, useState } from 'react';
import { useParse } from '../hooks/useParse';
import { ParsedEntry } from '@/lib/schemas/session';
import { SelfRating } from '@/lib/constants';
import { Button, IconButton } from './ui/Button';
import { FocusInput } from './FocusInput';
import { toLocalDateString } from '@/lib/utils/date';
import { getErrorMessage } from '@/lib/utils/api';
import { useCreateSession } from '../hooks/useCreateSession';

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

const isRowValid = ({ instrument, focus }: EditableParsedEntryRow) =>
  instrument !== null || focus.length > 0;

const rowReducer = (
  state: EditableParsedEntryRow[],
  action: RowAction
): EditableParsedEntryRow[] => {
  switch (action.type) {
    case RowActionType.SET:
      return action.rows.length ? action.rows : [];
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
  const [occurredOn, setOccurredOn] = useState(toLocalDateString(new Date()));
  const [errorRowIds, setErrorRowIds] = useState<Set<string>>(new Set());
  const [errorRowShaking, setErrorRowShaking] = useState(false);
  const [hasCreateErrored, setHasCreateErrored] = useState(false);

  const rawTextElement = useRef<HTMLTextAreaElement>(null);

  const [rows, dispatchRows] = useReducer(rowReducer, null, () => []);

  const {
    mutate: parse,
    isSuccess: parseSuccessful,
    isPending: isParsing,
    isError: parseFailed,
    error: parseError,
    reset: resetParse,
  } = useParse();

  const {
    mutate: create,
    isPending: isCreating,
    isError: createFailed,
    error: createError,
    reset: resetCreate,
  } = useCreateSession();

  const trimmedLength = rawText.trim().length;
  const rawTextHasValue = trimmedLength > 0 && trimmedLength <= 500;

  const isRawTextAreaLocked = isParsing || parseSuccessful;

  const showErrorForRow = (row: EditableParsedEntryRow) =>
    errorRowIds.has(row.tempId) && !isRowValid(row);

  const handleParse = () => {
    if (!rawTextHasValue || isRawTextAreaLocked) return;
    const trimmed = rawText.trim();
    setRawText(trimmed);
    rawTextElement.current?.blur();
    parse(trimmed, {
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
    setHasCreateErrored(false);
    resetParse();
    resetCreate();
    rawTextElement.current?.focus();
  };

  const handleCreate = () => {
    if (!rows.length || isCreating) return;

    if (!rows.every(isRowValid)) {
      setErrorRowIds(
        new Set(rows.filter(r => !isRowValid(r)).map(r => r.tempId))
      );
      setErrorRowShaking(true);
      return;
    }

    create(
      {
        rawText,
        occurredOn,
        entries: rows.map(({ tempId, ...entry }) => entry),
      },
      {
        onSuccess: () => {
          setRawText('');
          setErrorRowIds(new Set());
          dispatchRows({ type: RowActionType.SET, rows: [] });
          setHasCreateErrored(false);
          resetParse();
          resetCreate();
          rawTextElement.current?.focus();
        },
        onError: () => {
          setHasCreateErrored(true);
        },
      }
    );
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
        className={`input-wrapper flex flex-col gap-2 justify-center items-stretch w-2xl max-w-[100%] p-4 pt-6 pr-3 mb-1 rounded-3xl ${
          isRawTextAreaLocked
            ? 'cursor-default bg-neutral-200 dark:bg-neutral-700'
            : 'cursor-text bg-white dark:bg-neutral-900 shadow-sm focus-within:shadow-lg'
        }`}
      >
        <textarea
          className={`focus:outline-hidden resize-none pl-2 field-sizing-content max-h-42 overflow-y-auto scrollbar-thin scrollbar-gutter-stable placeholder-neutral-400 dark:placeholder-neutral-400 read-only:text-neutral-500 read-only:dark:text-neutral-400 ${
            isRawTextAreaLocked ? 'cursor-default' : 'cursor-text'
          }`}
          placeholder="How did it go?"
          onChange={e => setRawText(e.currentTarget.value)}
          value={rawText}
          onKeyDown={handleKeyDown}
          autoFocus
          readOnly={isRawTextAreaLocked}
          ref={rawTextElement}
          autoComplete="off"
        />
        <div className="flex justify-between items-end pr-1 pointer-events-none">
          <span
            className={`pl-2 text-sm ${
              isRawTextAreaLocked ? 'hidden' : ''
            } ${trimmedLength > 500 ? 'text-red-500 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-400'}`}
          >
            {`${trimmedLength} / 500`}
          </span>
          {!isRawTextAreaLocked && (
            <Button
              color="brand"
              aria-disabled={!rawTextHasValue || isRawTextAreaLocked}
              onClick={handleParse}
              aria-label="Parse your practice session summary"
            >
              <ScanText size={18} strokeWidth={2} />
              Parse
            </Button>
          )}
        </div>
      </div>
      {isParsing && (
        <div className="inline-flex justify-center gap-2 text-indigo-400 dark:text-indigo-300">
          <Disc3
            size={64}
            strokeWidth={1}
            className="animate-spin"
            aria-hidden
          />
        </div>
      )}
      {!isParsing && parseFailed && (
        <div className="text-red-500 dark:text-red-400 inline-flex items-center gap-2">
          <CircleAlert />
          <span className="text-neutral-500 dark:text-neutral-400">
            {getErrorMessage(parseError.message)}
          </span>
        </div>
      )}
      {!isParsing && !parseFailed && parseSuccessful && (
        <>
          {hasCreateErrored && (
            <div
              className={`text-red-500 dark:text-red-400 inline-flex justify-center items-center gap-2
                ${createFailed && !isCreating ? 'visible' : 'invisible'}`}
            >
              <CircleAlert />
              <span className="text-neutral-500 dark:text-neutral-400">
                {getErrorMessage(createError?.message || '')}
              </span>
            </div>
          )}
          <div className="flex flex-col w-2xl max-w-[100%] mb-4">
            <div className="flex items-center justify-end gap-4 pb-2">
              {!isCreating && (
                <Button variant="ghost" color="secondary" onClick={handleBack}>
                  <CornerLeftUp size={18} strokeWidth={2} />
                  Back
                </Button>
              )}
              <div className="flex gap-2 items-center justify-end grow">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Practiced on
                </span>
                <input
                  type="date"
                  value={occurredOn}
                  onChange={e => setOccurredOn(e.target.value)}
                  aria-disabled={isCreating}
                  readOnly={isCreating}
                  className="bg-white dark:bg-neutral-900 shadow-xs focus-within:shadow-md rounded-2xl px-4 py-2 focus:outline-none read-only:bg-neutral-200 read-only:dark:bg-neutral-700 read-only:text-neutral-500 read-only:dark:text-neutral-400"
                />
              </div>
              {isCreating ? (
                <div className=" inline-flex items-center justify-center gap-2 text-indigo-400 dark:text-indigo-300 w-22">
                  <Disc3
                    size={40}
                    strokeWidth={1.5}
                    className="animate-spin"
                    aria-hidden
                  />
                </div>
              ) : (
                <Button
                  color="success"
                  aria-disabled={!rows.length || isCreating}
                  onClick={handleCreate}
                  aria-label="Create session"
                  className="w-22"
                >
                  <Activity size={18} strokeWidth={2} />
                  Log
                </Button>
              )}
            </div>
            <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,2fr)_minmax(0,2fr)_auto] gap-2 pb-2 mb-2 border-b-2 border-neutral-300 dark:border-neutral-700">
              <div className="grid grid-cols-subgrid col-span-5 gap-2 py-2 pb-2 text-neutral-500 dark:text-neutral-400 border-b-2 border-neutral-300 dark:border-neutral-700">
                <span>Instrument</span>
                <span>Focus</span>
                <span>Rating</span>
                <span>Duration</span>
                <span className="min-w-[40px]" />
              </div>
              {rows.length === 0 && (
                <div className="grid grid-cols-subgrid col-span-5 text-blue-500 dark:text-blue-400 py-2 self-center justify-center items-center inline-flex gap-2">
                  <InfoIcon />
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Nothing was parsed. Edit your summary to be more specific.
                  </span>
                </div>
              )}
              {rows.map(row => (
                <div
                  key={row.tempId}
                  className={`grid grid-cols-subgrid col-span-5 gap-2 items-stretch ${
                    errorRowShaking && showErrorForRow(row)
                      ? 'animate-shake'
                      : ''
                  }`}
                  onAnimationEnd={() => setErrorRowShaking(false)}
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
                    className={`bg-white dark:bg-neutral-900 shadow-xs focus:shadow-md rounded-2xl px-4 py-2 outline-2
                      read-only:bg-neutral-200 read-only:dark:bg-neutral-700 read-only:text-neutral-500 read-only:dark:text-neutral-400 read-only:cursor-default
                      ${
                        showErrorForRow(row)
                          ? 'outline-red-500 dark:outline-red-400'
                          : 'outline-transparent focus:outline-transparent'
                      }`}
                    aria-disabled={isCreating}
                    readOnly={isCreating}
                  />
                  <FocusInput
                    focus={row.focus}
                    error={showErrorForRow(row)}
                    onChange={next => {
                      dispatchRows({
                        type: RowActionType.UPDATE,
                        tempId: row.tempId,
                        patch: { focus: next },
                      });
                    }}
                    disabled={isCreating}
                  />
                  <select
                    value={row.selfRating ?? ''}
                    onChange={e => {
                      if (!isCreating)
                        dispatchRows({
                          type: RowActionType.UPDATE,
                          tempId: row.tempId,
                          patch: {
                            selfRating:
                              e.target.value === ''
                                ? null
                                : (e.target.value as SelfRating),
                          },
                        });
                    }}
                    disabled={isCreating}
                    className={`bg-white dark:bg-neutral-900 shadow-xs focus:shadow-md rounded-2xl px-4 py-2
                      disabled:bg-neutral-200 disabled:dark:bg-neutral-700 disabled:text-neutral-500 disabled:dark:text-neutral-400`}
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
                    disabled={isCreating}
                    className={`bg-white dark:bg-neutral-900 shadow-xs focus:shadow-md rounded-2xl px-4 py-2 focus:outline-none
                      read-only:bg-neutral-200 read-only:dark:bg-neutral-700 read-only:text-neutral-500 read-only:dark:text-neutral-400`}
                  />
                  {!isCreating && (
                    <IconButton
                      className="self-center"
                      variant="ghost"
                      color="error"
                      onClick={() => {
                        if (isCreating) return;
                        dispatchRows({
                          type: RowActionType.DELETE,
                          tempId: row.tempId,
                        });
                      }}
                      aria-label="Delete row"
                      aria-disabled={rows.length <= 1 || isCreating}
                    >
                      <X size={18} strokeWidth={2} />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
            <div
              className={`flex items-center justify-end ${!isCreating ? 'visible' : 'invisible'}`}
            >
              {rows.some(showErrorForRow) && (
                <div className="text-red-500 dark:text-red-400 inline-flex items-center gap-2 py-2 grow">
                  <CircleAlert />
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Each entry needs an <strong>instrument</strong> or{' '}
                    <strong>focus</strong>.
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                color="secondary"
                onClick={() => {
                  if (rows.length < 10 && !isCreating)
                    dispatchRows({
                      type: RowActionType.ADD,
                    });
                }}
                aria-disabled={rows.length >= 10}
              >
                <Plus size={18} strokeWidth={2} />
                Add entry
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
