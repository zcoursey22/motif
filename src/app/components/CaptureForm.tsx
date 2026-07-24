'use client';

import { Disc3, Play, SkipForward, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { useParse } from '../hooks/useParse';
import { ParsedEntry } from '@/lib/schemas/parse';

export default function CaptureForm() {
  const [rawText, setRawText] = useState('');
  const rawTextElement = useRef<HTMLTextAreaElement>(null);

  const [entries, setEntries] = useState<ParsedEntry[] | null>(null);

  const { mutate, isPending, isError, error, reset } = useParse();

  const rawTextLength = rawText.length;
  const trimmedLength = rawText.trim().length;
  const rawTextHasValue = trimmedLength > 0 && trimmedLength <= 500;

  const isRawTextAreaLocked = isPending || (!!entries && !isError);

  const handleParse = () => {
    if (!rawTextHasValue || isRawTextAreaLocked) return;
    const trimmed = rawText.trim();
    setRawText(trimmed);
    rawTextElement.current?.blur();
    mutate(trimmed, {
      onSuccess: entries => {
        setEntries(entries);
      },
      onError: () => rawTextElement.current?.focus(),
    });
  };

  const handleReset = () => {
    setRawText('');
    setEntries(null);
    reset();
    rawTextElement.current?.focus();
  };

  const handleSubmit = () => {
    if (!entries?.length) return;
    setRawText('');
    setEntries(null);
    reset();
    rawTextElement.current?.focus();
  };

  const handleTextAreaContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) rawTextElement.current?.focus();
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
        className={`flex flex-col gap-2 justify-center items-stretch w-2xl max-w-[100%] p-4 pt-6 pr-3 rounded-3xl cursor-text ${
          isRawTextAreaLocked
            ? 'inset-shadow-sm/50'
            : 'bg-white dark:bg-neutral-700 shadow-xs focus-within:shadow-lg'
        }`}
      >
        <textarea
          className="focus:outline-hidden resize-none pl-2 field-sizing-content max-h-42 overflow-y-auto scrollbar-thin scrollbar-gutter-stable placeholder-neutral-500 dark:placeholder-neutral-300 read-only:text-neutral-600 read-only:dark:text-neutral-400"
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
            className={`bg-blue-500 hover:bg-blue-400 aria-disabled:bg-slate-300 dark:aria-disabled:bg-slate-500 text-white aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400 p-2 rounded-lg cursor-pointer aria-disabled:cursor-text pointer-events-auto ${
              isRawTextAreaLocked ? 'hidden' : ''
            }`}
            aria-disabled={!rawTextHasValue || isRawTextAreaLocked}
            onClick={handleParse}
            aria-label="Parse"
          >
            <SkipForward size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {isPending && (
        <div className="inline-flex justify-center gap-2 text-neutral-700 dark:text-neutral-300">
          <Disc3
            size={64}
            strokeWidth={1}
            className="animate-spin"
            aria-label="Loading"
          />
        </div>
      )}
      {!isPending && isError && (
        <span className="text-red-500">Error: {error.message}</span>
      )}
      {!isPending && !isError && isRawTextAreaLocked && (
        <div className="inline-flex items-center gap-2">
          <span>{entries?.length || 0} entries parsed</span>
          <button
            className="bg-red-500 hover:bg-red-400 aria-disabled:bg-mauve-300 dark:aria-disabled:bg-mauve-500 text-white aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400 p-2 rounded-lg cursor-pointer aria-disabled:cursor-default pointer-events-auto"
            onClick={handleReset}
            aria-label="Reset"
          >
            <Square size={18} strokeWidth={2.5} />
          </button>
          <button
            className="bg-green-500 hover:bg-green-400 aria-disabled:bg-mist-300 dark:aria-disabled:bg-mist-500 text-white aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-400 p-2 rounded-lg cursor-pointer aria-disabled:cursor-default pointer-events-auto"
            aria-disabled={!entries?.length}
            onClick={handleSubmit}
            aria-label="Submit"
          >
            <Play size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </>
  );
}
