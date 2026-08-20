'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ActionColor } from './constants';
import { Button } from './Button';

type ConfirmModalProps = {
  isOpen: boolean;
  message: string;
  confirmLabel: string;
  confirmColor: ActionColor;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={onCancel}
    >
      <div
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 p-6 shadow-md border-2 border-neutral-300 dark:border-neutral-700"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <p className="text-neutral-600 dark:text-neutral-300">{message}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} variant="ghost">
            Cancel
          </Button>
          <Button onClick={onConfirm} color={confirmColor}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
