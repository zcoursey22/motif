'use client';

import { EditableEntry } from '@/lib/schemas/session';
import { MultiSelect } from './ui/MultiSelect';
import { IconButton } from './ui/Button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { StarRating } from './StarRating';
import {
  FOCUS_GROUPS,
  FOCUS_LABELS,
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
          <MultiSelect
            value={focus}
            groups={FOCUS_GROUPS}
            labels={FOCUS_LABELS}
            ariaLabel="Focus"
          />
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
                      focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400
                      ${
                        isInvalid
                          ? 'outline-red-500 dark:outline-red-400'
                          : 'outline-transparent focus:outline-transparent focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400'
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
      <MultiSelect
        value={focus}
        onChange={next => onUpdate?.(id, { focus: next })}
        groups={FOCUS_GROUPS}
        labels={FOCUS_LABELS}
        error={isInvalid}
        disabled={isBusy}
        ariaLabel="Focus"
      />
      <div
        className={`flex items-stretch justify-center bg-white dark:bg-black shadow-xs focus-within:shadow-md rounded-2xl px-4 py-2 has-focus-visible:outline-2 has-focus-visible:outline-blue-500 dark:has-focus-visible:outline-blue-400 ${
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
          bg-white dark:bg-black shadow-xs focus:shadow-md rounded-2xl px-4 py-2
                      read-only:field-busy
                      focus-visible:outline-2 focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400`}
        aria-label="Duration"
        // TODO: Why can't I get no outline on focus, but outline on focus-visible for this field only?
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
          icon={X}
        />
      )}
    </div>
  );
}
