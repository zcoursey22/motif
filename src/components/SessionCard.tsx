'use client';

import { useState } from 'react';
import { isEntryValid } from '@/lib/schemas/session';
import { getSessions } from '@/lib/actions/sessions';
import { EntryTable } from './EntryTable';
import { Button, IconButton } from './ui/Button';
import { useEntryRows } from '@/hooks/useEntryRows';
import { Edit, Trash2 } from 'lucide-react';
import { parseLocalDate } from '@/lib/utils/date';
import { useDeleteSession, useUpdateSession } from '@/hooks/useSessions';
import { CollapsibleText } from './ui/CollapsibleText';

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

  const handleEditSave = () => {
    if (isBusy) return;

    if (!rows.every(isEntryValid)) {
      setValidationAttempts(n => n + 1);
      return;
    }

    setIsBusy(true);
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
      }
    );
  };

  const handleEditCancel = () => {
    if (isBusy) return;

    setOccurredOn(session.occurredOn);
    setRows(entries);
    setMode('read');
  };

  const handleDelete = () => {
    if (isBusy) return;

    setIsBusy(true);
    deleteSession({ id });
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
    <div className="flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-3xl shadow-sm">
      <div
        className={`px-4 pt-4 gap-2 text-neutral-600 dark:text-neutral-300 flex flex-col ${
          mode === 'edit' ? '' : 'pb-2'
        }`}
      >
        <div className="flex justify-between">
          <span className="min-h-[40px] pl-2 pt-2">{getDateString()}</span>
          <div className="flex gap-2">
            {mode === 'read' ? (
              <>
                <IconButton
                  variant="ghost"
                  onClick={() => {
                    if (!isBusy) setMode('edit');
                  }}
                  aria-disabled={isBusy}
                  aria-label="Edit session"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  variant="ghost"
                  color="error"
                  onClick={handleDelete}
                  aria-disabled={isBusy}
                  aria-label="Delete session"
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
        <CollapsibleText text={rawText} spanClassName="py-2" />
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
