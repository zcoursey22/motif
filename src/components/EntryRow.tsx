'use client';

import { EditableEntry } from '@/lib/schemas/session';
import { FocusInput } from './FocusInput';
import { SelfRating } from '@/lib/constants';
import { IconButton } from './ui/Button';
import { X } from 'lucide-react';
import { useState } from 'react';

type EntryRowProps = {
  row: EditableEntry;
  mode: 'edit' | 'read';
  isBusy?: boolean;
  isInvalid?: boolean;
  canRemove?: boolean;
  onUpdate?: (rowId: string, patch: Partial<EditableEntry>) => void;
  onRemove?: (rowId: string) => void;
  validationAttempts: number;
};

export function EntryRow({
  row,
  mode,
  isBusy,
  isInvalid,
  canRemove = true,
  onUpdate,
  onRemove,
  validationAttempts,
}: EntryRowProps) {
  const [lastShakeAttempt, setLastShakeAttempt] = useState(validationAttempts);
  const shaking = validationAttempts > lastShakeAttempt && isInvalid;

  const { id, instrument, focus, selfRating, durationMin } = row;

  return (
    <div
      className={`grid grid-cols-subgrid col-span-5 gap-2 items-stretch ${
        shaking ? 'animate-shake' : ''
      }`}
      onAnimationEnd={() => setLastShakeAttempt(validationAttempts)}
    >
      <input
        type="text"
        value={instrument ?? ''}
        onChange={e => {
          if (isBusy || mode === 'read') return;
          onUpdate?.(id, {
            instrument: e.target.value.trim() || null,
          });
        }}
        className={`bg-white dark:bg-black shadow-xs focus:shadow-md rounded-2xl px-4 py-2 outline-2
                      read-only:bg-neutral-200 read-only:dark:bg-neutral-700 read-only:text-neutral-500 read-only:dark:text-neutral-400 read-only:cursor-default
                      ${
                        isInvalid
                          ? 'outline-red-500 dark:outline-red-400'
                          : 'outline-transparent focus:outline-transparent'
                      }`}
        aria-disabled={isBusy || mode === 'read'}
        readOnly={isBusy || mode === 'read'}
        aria-label="Instrument"
      />
      <FocusInput
        focus={focus}
        error={isInvalid}
        onChange={next => {
          onUpdate?.(id, {
            focus: next,
          });
        }}
        disabled={isBusy || mode === 'read'}
      />
      <select
        value={selfRating ?? ''}
        onChange={e => {
          if (isBusy || mode === 'read') return;
          onUpdate?.(id, {
            selfRating:
              e.target.value === '' ? null : (e.target.value as SelfRating),
          });
        }}
        disabled={isBusy || mode === 'read'}
        className={`bg-white dark:bg-black shadow-xs focus:shadow-md rounded-2xl px-4 py-2
                      disabled:bg-neutral-200 disabled:dark:bg-neutral-700 disabled:text-neutral-500 disabled:dark:text-neutral-400`}
        aria-label="Rating"
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
        value={durationMin ?? ''}
        onChange={e => {
          if (isBusy || mode === 'read') return;
          const n = e.target.value === '' ? null : Number(e.target.value);
          onUpdate?.(id, { durationMin: Number.isFinite(n) ? n : null });
        }}
        disabled={isBusy || mode === 'read'}
        className={`bg-white dark:bg-black shadow-xs focus:shadow-md rounded-2xl px-4 py-2 focus:outline-none
                      read-only:bg-neutral-200 read-only:dark:bg-neutral-700 read-only:text-neutral-500 read-only:dark:text-neutral-400`}
        aria-label="Duration"
      />
      {!isBusy && mode === 'edit' && (
        <IconButton
          className="self-center"
          variant="ghost"
          color="error"
          onClick={() => {
            if (!canRemove) return;
            onRemove?.(id);
          }}
          aria-label="Delete row"
          aria-disabled={!canRemove}
        >
          <X size={18} strokeWidth={2} />
        </IconButton>
      )}
    </div>
  );
}
