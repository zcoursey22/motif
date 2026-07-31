import { EditableEntry, isEntryValid } from '@/lib/schemas/session';
import { AppError } from '@/lib/utils/api';
import { EntryRow } from './EntryRow';
import { Button } from './ui/Button';
import { CircleAlert, InfoIcon, Plus } from 'lucide-react';

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
      <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,2fr)_minmax(0,2fr)_auto] gap-2 pb-2 mb-2 border-b-2 border-neutral-300 dark:border-neutral-700">
        <div className="grid grid-cols-subgrid col-span-5 gap-2 py-2 pb-2 text-neutral-500 dark:text-neutral-400 border-b-2 border-neutral-300 dark:border-neutral-700">
          <span>Instrument</span>
          <span>Focus</span>
          <span>Rating</span>
          <span>Duration</span>
          <span className="min-w-[40px]" />
        </div>
        {rows.length === 0 && !listError && (
          <div className="grid grid-cols-subgrid col-span-5 text-blue-500 dark:text-blue-400 py-2 self-center justify-center items-center inline-flex gap-2">
            <InfoIcon />
            <span className="text-neutral-500 dark:text-neutral-400">
              Nothing was parsed. Edit your summary to be more specific.
            </span>
          </div>
        )}
        {!!listError && (
          <div className="grid grid-cols-subgrid col-span-5 text-red-500 dark:text-red-400 py-2 self-center justify-center items-center inline-flex gap-2">
            <CircleAlert />
            <span className="text-neutral-500 dark:text-neutral-400">
              {listError.message}
            </span>
          </div>
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
      <div
        className={`flex items-center justify-end ${!isBusy ? 'visible' : 'invisible'}`}
      >
        <div
          className={`text-red-500 dark:text-red-400 inline-flex items-center gap-2 py-2 grow
          ${!!invalidRowIds.length && validationAttempts > 0 ? 'visible' : 'invisible'}`}
        >
          <CircleAlert />
          <span className="text-neutral-500 dark:text-neutral-400">
            Each entry needs an <strong>instrument</strong> or{' '}
            <strong>focus</strong>.
          </span>
        </div>
        {onAdd && (
          <Button
            variant="ghost"
            color="secondary"
            onClick={() => {
              if (rows.length < MAX_ROWS && !isBusy) onAdd?.();
            }}
            aria-disabled={rows.length >= MAX_ROWS}
            icon={Plus}
          >
            Add entry
          </Button>
        )}
      </div>
    </>
  );
}
