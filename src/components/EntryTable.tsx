'use client';

import { EditableEntry, isEntryValid } from '@/lib/schemas/session';
import { AppError } from '@/lib/utils/api';
import { EntryRow } from './EntryRow';
import { Button } from './ui/Button';
import { MinusCircle, Plus, PlusCircle } from 'lucide-react';
import { Notice } from './ui/Notice';

type EntryTableProps = {
  rows: EditableEntry[];
  mode: 'edit' | 'read';
  isBusy?: boolean;
  onAdd?: () => void;
  onUpdate?: (rowId: string, patch: Partial<EditableEntry>) => void;
  onRemove?: (rowId: string) => void;
  listError?: AppError;
  validationAttempts: number;
};

const MAX_ROWS = 10;

function FullWidthRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-subgrid col-span-5 py-2 self-center justify-center items-center inline-flex gap-2">
      {children}
    </div>
  );
}

export function EntryTable({
  rows,
  mode,
  isBusy,
  onAdd,
  onUpdate,
  onRemove,
  listError,
  validationAttempts,
}: EntryTableProps) {
  const invalidRowIds = rows.filter(r => !isEntryValid(r)).map(r => r.id);

  return (
    <>
      <div
        className={`grid gap-2
        ${
          mode === 'edit'
            ? 'grid-cols-[minmax(0,3.5fr)_minmax(0,8fr)_minmax(0,auto)_minmax(0,2.5fr)_auto] pb-2 mb-2 border-b-2 border-neutral-300 dark:border-neutral-700'
            : 'grid-cols-[minmax(0,2fr)_minmax(auto,8fr)_minmax(0,auto)_minmax(0,1fr)]'
        }`}
      >
        {mode === 'edit' && (
          <div className="grid font-medium grid-cols-subgrid col-span-5 gap-2 py-2 pb-2 text-neutral-500 dark:text-neutral-400 border-b-2 border-neutral-300 dark:border-neutral-700">
            <span className="px-4">Instrument</span>
            <span className="px-4">Focus</span>
            <span className="px-4">Rating</span>
            <span className="px-4">Duration</span>
            {mode === 'edit' && <span className="min-w-[40px]" />}
          </div>
        )}
        {rows.length === 0 && !listError && (
          <FullWidthRow>
            <Notice variant="info">
              Nothing was parsed. Edit your summary to be more specific.
            </Notice>
          </FullWidthRow>
        )}
        {!!listError && (
          <FullWidthRow>
            <Notice>{listError.message}</Notice>
          </FullWidthRow>
        )}
        {rows.map(row => (
          <EntryRow
            key={row.id}
            row={row}
            mode={mode}
            isBusy={isBusy}
            isInvalid={
              validationAttempts > 0 &&
              invalidRowIds.includes(row.id) &&
              !isEntryValid(row)
            }
            canRemove={rows.length > 1}
            onUpdate={onUpdate}
            onRemove={onRemove}
            validationAttempts={validationAttempts}
          />
        ))}
      </div>
      {mode === 'edit' && (
        <div
          className={`flex items-center justify-end ${!isBusy ? 'visible' : 'invisible'}`}
        >
          <div
            className={`text-red-500 dark:text-red-400 inline-flex items-center gap-2 py-2 grow
          ${!!invalidRowIds.length && validationAttempts > 0 ? 'visible' : 'invisible'}`}
          >
            <Notice>
              Each entry needs an{' '}
              <span className="font-medium">instrument</span> or{' '}
              <span className="font-medium">focus</span>.
            </Notice>
          </div>
          {onAdd && (
            <Button
              variant="ghost"
              color="secondary"
              onClick={() => {
                if (rows.length < MAX_ROWS && !isBusy) onAdd?.();
              }}
              aria-disabled={rows.length >= MAX_ROWS}
              icon={PlusCircle}
            >
              Add entry
            </Button>
          )}
        </div>
      )}
    </>
  );
}
