'use client';

import {
  Activity,
  CircleAlert,
  CornerLeftUp,
  Disc3,
  ScanText,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useParse } from '../hooks/useParse';
import { isEntryValid } from '@/lib/schemas/session';
import { Button } from './ui/Button';
import { toLocalDateString } from '@/lib/utils/date';
import { AppError, getErrorMessage } from '@/lib/utils/api';
import { useCreateSession } from '../hooks/useSessions';
import { useRouter } from 'next/navigation';
import { EntryTable } from './EntryTable';
import { useEntryRows } from '@/hooks/useEntryRows';
import { CollapsibleText } from './ui/CollapsibleText';

export default function CaptureForm() {
  const [rawText, setRawText] = useState('');
  const [occurredOn, setOccurredOn] = useState(toLocalDateString(new Date()));
  const [hasCreateErrored, setHasCreateErrored] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionAttempts, setSubmissionAttempts] = useState(0);

  const { rows, setRows, updateRow, removeRow, addRow } = useEntryRows([]);

  const rawTextElement = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

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
    isError: createFailed,
    error: createError,
    reset: resetCreate,
  } = useCreateSession();

  const trimmedLength = rawText.trim().length;
  const rawTextHasValue = trimmedLength > 0 && trimmedLength <= 500;

  const isRawTextAreaLocked = isParsing || parseSuccessful;

  const handleParse = () => {
    if (!rawTextHasValue || isRawTextAreaLocked) return;
    const trimmed = rawText.trim();
    setRawText(trimmed);
    rawTextElement.current?.blur();
    parse(trimmed, {
      onSuccess: parsed => {
        setRows(parsed.entries.map(p => ({ ...p, id: crypto.randomUUID() })));
        setOccurredOn(parsed.occurredOn);
      },
      onError: () => rawTextElement.current?.focus(),
    });
  };

  const handleBack = () => {
    setRows([]);
    setHasCreateErrored(false);
    setSubmissionAttempts(0);
    resetParse();
    resetCreate();
    rawTextElement.current?.focus();
  };

  const handleCreate = () => {
    if (!rows.length || isSubmitting) return;

    if (!rows.every(isEntryValid)) {
      setSubmissionAttempts(n => n + 1);
      return;
    }

    setIsSubmitting(true);
    create(
      {
        rawText,
        occurredOn,
        entries: rows.map(({ id, ...entry }) => entry),
      },
      {
        onSuccess: () => {
          router.push('/sessions');
        },
        onError: () => {
          setIsSubmitting(false);
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
        className={`input-wrapper flex flex-col gap-2 justify-center items-stretch w-full rounded-3xl bg-white dark:bg-black ${
          isRawTextAreaLocked
            ? 'cursor-default p-2 read-only:field-busy'
            : 'cursor-text shadow-sm focus-within:shadow-lg p-4 pt-6'
        }`}
      >
        {isRawTextAreaLocked ? (
          <CollapsibleText
            text={rawText}
            className="pt-2 pl-4 pr-2"
            spanClassName="py-2"
          />
        ) : (
          <textarea
            className={`focus:outline-hidden resize-none field-sizing-content max-h-42 px-2 overflow-y-auto scrollbar-thin scrollbar-gutter-stable placeholder-neutral-400 dark:placeholder-neutral-400 read-only:text-neutral-500 read-only:dark:text-neutral-400 ${
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
        )}
        <div className="flex justify-between items-end pointer-events-none">
          <span
            className={`text-sm font-mono pl-2 ${
              isRawTextAreaLocked ? 'hidden' : ''
            } ${trimmedLength > 500 ? 'text-red-500 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'}`}
          >
            {`${trimmedLength} / 500`.padStart(9)}
          </span>
          {!isRawTextAreaLocked && (
            <Button
              color="brand"
              aria-disabled={!rawTextHasValue || isRawTextAreaLocked}
              onClick={handleParse}
              aria-label="Parse your practice session summary"
              icon={ScanText}
            >
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
          <span className="text-neutral-600 dark:text-neutral-300">
            {getErrorMessage((parseError as AppError).code)}
          </span>
        </div>
      )}
      {!isParsing && !parseFailed && parseSuccessful && (
        <>
          {hasCreateErrored && (
            <div
              className={`text-red-500 dark:text-red-400 inline-flex justify-center items-center gap-2
                ${createFailed && !isSubmitting ? 'visible' : 'invisible'}`}
            >
              <CircleAlert />
              <span className="text-neutral-600 dark:text-neutral-300">
                {getErrorMessage((createError as AppError).code)}
              </span>
            </div>
          )}
          <div className="flex flex-col w-full mb-4">
            <div className="flex items-center justify-end gap-4 pb-2">
              {!isSubmitting && (
                <Button
                  variant="ghost"
                  color="secondary"
                  onClick={handleBack}
                  icon={CornerLeftUp}
                >
                  Back
                </Button>
              )}
              <div className="flex gap-2 items-center justify-end grow">
                <span className="font-medium text-neutral-500 dark:text-neutral-400">
                  Practiced on
                </span>
                <input
                  type="date"
                  value={occurredOn}
                  onChange={e => setOccurredOn(e.target.value)}
                  aria-disabled={isSubmitting}
                  readOnly={isSubmitting}
                  className="bg-white dark:bg-black shadow-xs focus-within:shadow-md rounded-2xl px-4 py-2 focus:outline-none read-only:field-busy"
                />
              </div>
              {isSubmitting ? (
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
                  aria-disabled={!rows.length || isSubmitting}
                  onClick={handleCreate}
                  aria-label="Create session"
                  className="w-22"
                  icon={Activity}
                >
                  Log
                </Button>
              )}
            </div>
            <div className="[--entry-input-busy-bg:theme(colors.neutral.100)] dark:[--entry-input-busy-bg:theme(colors.neutral.800)]">
              <EntryTable
                rows={rows}
                mode={'edit'}
                validationAttempts={submissionAttempts}
                onAdd={addRow}
                onUpdate={updateRow}
                onRemove={removeRow}
                isBusy={isSubmitting}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
