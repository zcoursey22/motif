'use client';

import { useState } from 'react';
import { isEntryValid } from '@/lib/schemas/session';
import { getSessions } from '@/lib/actions/sessions';
import { EntryTable } from './EntryTable';
import { Button, IconButton } from './ui/Button';
import { useEntryRows } from '@/hooks/useEntryRows';
import { CircleAlert, Edit, Trash2 } from 'lucide-react';
import { parseLocalDate } from '@/lib/utils/date';
import { useDeleteSession, useUpdateSession } from '@/hooks/useSessions';
import { CollapsibleText } from './ui/CollapsibleText';
import { AppError, getErrorMessage } from '@/lib/utils/api';

type Props = { session: Awaited<ReturnType<typeof getSessions>>[number] };

export default function SessionCard({ session }: Props) {
  const { id, rawText, entries } = session;

  const [occurredOn, setOccurredOn] = useState(session.occurredOn);

  const { rows, setRows, updateRow, removeRow, addRow } = useEntryRows(entries);

  const { mutate: updateSession } = useUpdateSession();

  const { mutate: deleteSession } = useDeleteSession();

  const [mode, setMode] = useState<'read' | 'edit'>('read');
  const [validationAttempts, setValidationAttempts] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditSave = () => {
    if (isBusy) return;

    if (!rows.every(isEntryValid)) {
      setValidationAttempts(n => n + 1);
      return;
    }

    setIsBusy(true);
    setError(null);
    updateSession(
      {
        id,
        payload: { occurredOn, entries: rows },
      },
      {
        onSuccess: () => {
          setIsBusy(false);
          setMode('read');
        },
        onError: e => {
          setIsBusy(false);
          setError(getErrorMessage((e as AppError).code));
        },
      }
    );
  };

  const handleEditCancel = () => {
    if (isBusy) return;

    setError(null);
    setOccurredOn(session.occurredOn);
    setRows(entries);
    setMode('read');
  };

  const handleDelete = () => {
    if (isBusy) return;

    setError(null);
    setIsBusy(true);
    deleteSession(
      { id },
      {
        onError: e => {
          setIsBusy(false);
          setError(getErrorMessage((e as AppError).code));
        },
      }
    );
  };

  const getDateString = () => {
    const d = parseLocalDate(occurredOn);
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      year:
        d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-3xl shadow-sm
      ${isBusy ? 'field-busy' : ''}`}
    >
      <div
        className={`px-4 pt-4 gap-2 text-neutral-600 dark:text-neutral-300 flex flex-col ${
          mode === 'edit' ? '' : 'pb-2'
        }`}
      >
        <div className={`flex justify-between pl-2`}>
          <span className="min-h-[40px] pt-2 font-medium">
            {getDateString()}
          </span>
          <div
            className={`text-red-500 dark:text-red-400 inline-flex justify-center items-center gap-2
                ${error ? 'visible' : 'invisible'}`}
          >
            <CircleAlert />
            <span className="text-neutral-600 dark:text-neutral-300">
              {error || ''}
            </span>
          </div>
          <div className="flex gap-2">
            {mode === 'read' ? (
              <>
                <IconButton
                  variant="ghost"
                  onClick={() => {
                    if (!isBusy) {
                      setMode('edit');
                      setError(null);
                    }
                  }}
                  aria-disabled={isBusy}
                  aria-label="Edit session"
                  isBusyUnstyled
                >
                  <Edit />
                </IconButton>
                <IconButton
                  variant="ghost"
                  color="error"
                  onClick={handleDelete}
                  aria-disabled={isBusy}
                  aria-label="Delete session"
                  isBusyUnstyled
                >
                  <Trash2 />
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleEditCancel}
                  aria-disabled={isBusy}
                  aria-label="Cancel edit of session"
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  onClick={handleEditSave}
                  aria-disabled={isBusy}
                  aria-label="Save edit of session"
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        <CollapsibleText text={rawText} spanClassName="py-2 italic pl-2" />
      </div>

      <div
        className={`[--entry-input-busy-bg:theme(colors.neutral.200)] dark:[--entry-input-busy-bg:theme(colors.neutral.800)]
        ${mode === 'edit' ? 'pb-4 px-4' : 'pb-4 pl-4 pr-2'}`}
      >
        <EntryTable
          rows={rows}
          mode={mode}
          isBusy={isBusy}
          validationAttempts={validationAttempts}
          onAdd={addRow}
          onUpdate={updateRow}
          onRemove={removeRow}
        />
      </div>
    </div>
  );
}
