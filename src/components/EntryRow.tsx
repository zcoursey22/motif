'use client';

import { EditableEntry } from '@/lib/schemas/session';
import { FocusMultiSelect } from './FocusMultiSelect';
import { IconButton } from './ui/Button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { StarRating } from './StarRating';
import {
  Instrument,
  INSTRUMENT_GROUPS,
  INSTRUMENT_LABELS,
} from '@/lib/constants';

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

  if (mode === 'read') {
    return (
      <div className="grid grid-cols-subgrid col-span-5 gap-2 items-center text-neutral-600 dark:text-neutral-300 pr-2 pb-2 pl-2">
        <span className="font-medium">
          {instrument ? INSTRUMENT_LABELS[instrument] : '-'}
        </span>
        <span>
          {focus?.length ? <FocusMultiSelect focus={focus} /> : <span>-</span>}
        </span>
        <StarRating value={selfRating} />
        <span className="text-right font-medium">
          {durationMin != null ? `${durationMin}m` : '-'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-subgrid col-span-5 gap-2 items-stretch ${
        shaking ? 'animate-shake' : ''
      }`}
      onAnimationEnd={() => setLastShakeAttempt(validationAttempts)}
    >
      <select
        value={instrument ?? ''}
        onChange={e => {
          if (isBusy) return;
          onUpdate?.(id, {
            instrument: (e.target.value as Instrument) || null,
          });
        }}
        className={`placeholder-neutral-300 dark:placeholder-neutral-600
          bg-white dark:bg-black shadow-xs focus:shadow-md rounded-2xl px-4 py-2 outline-2
                      aria-disabled:field-busy aria-disabled:cursor-default aria-disabled:point-events-none
                      ${
                        isInvalid
                          ? 'outline-red-500 dark:outline-red-400'
                          : 'outline-transparent focus:outline-transparent'
                      }`}
        aria-disabled={isBusy}
        aria-label="Instrument"
      >
        <option value=""></option>
        <option value="voice">Voice</option>
        {INSTRUMENT_GROUPS.map(g => (
          <optgroup key={g.label} label={g.label}>
            {g.items.map(v => (
              <option key={v} value={v}>
                {INSTRUMENT_LABELS[v]}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <FocusMultiSelect
        focus={focus}
        error={isInvalid}
        onChange={next => {
          onUpdate?.(id, {
            focus: next,
          });
        }}
        disabled={isBusy}
      />
      <div
        className={`flex items-stretch justify-center bg-white dark:bg-black shadow-xs rounded-2xl px-4 py-2 ${
          isBusy ? 'field-busy' : ''
        }`}
      >
        <StarRating
          value={selfRating}
          disabled={isBusy}
          onChange={e => {
            if (isBusy) return;
            onUpdate?.(id, { selfRating: e });
          }}
        />
      </div>
      <input
        type="number"
        min={1}
        value={durationMin ?? ''}
        placeholder="min"
        onChange={e => {
          if (isBusy) return;
          const n = e.target.value === '' ? null : Number(e.target.value);
          onUpdate?.(id, { durationMin: Number.isFinite(n) ? n : null });
        }}
        disabled={isBusy}
        className={`placeholder-neutral-300 dark:placeholder-neutral-600
          bg-white dark:bg-black shadow-xs focus:shadow-md rounded-2xl px-4 py-2 focus:outline-none
                      read-only:field-busy`}
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
