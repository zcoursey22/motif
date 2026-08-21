'use client';

import { Focus, FOCUS_GROUPS, FOCUS_LABELS } from '@/lib/constants';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type FocusMultiSelectProps = {
  focus: Focus[];
  onChange?: (next: Focus[]) => void;
  error?: boolean;
  disabled?: boolean;
};

const VISIBLE_CHIPS = 3;

function Chip({ label }: { label: string }) {
  return (
    <span className="shrink-0 inline-flex items-center font-medium text-sm px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200">
      {label}
    </span>
  );
}

function ChipSummary({ focus }: { focus: Focus[] }) {
  if (!focus.length) {
    return (
      <span className="text-neutral-300 dark:text-neutral-600 pl-2">
        Click to add
      </span>
    );
  }
  if (focus.length <= VISIBLE_CHIPS) {
    return (
      <>
        {focus.map(tag => (
          <Chip key={tag} label={FOCUS_LABELS[tag]} />
        ))}
      </>
    );
  }
  const shown = focus.slice(0, VISIBLE_CHIPS - 1);
  const remaining = focus.length - shown.length;
  return (
    <>
      {shown.map(tag => (
        <Chip key={tag} label={FOCUS_LABELS[tag]} />
      ))}
      <Chip label={`+${remaining} more`} />
    </>
  );
}

export function FocusMultiSelect({
  focus,
  onChange,
  error,
  disabled,
}: FocusMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, maxHeight: 400 });
  const refEl = useRef<HTMLDivElement>(null);
  const floatEl = useRef<HTMLDivElement>(null);

  const readOnly = !onChange;

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const el = refEl.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const top = r.bottom + 4;
      setPos({
        top,
        left: r.left,
        maxHeight: Math.min(400, window.innerHeight - top - 8),
      });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!refEl.current?.contains(t) && !floatEl.current?.contains(t)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (tag: Focus) => {
    if (readOnly || disabled) return;
    onChange!(
      focus.includes(tag) ? focus.filter(f => f !== tag) : [...focus, tag]
    );
  };

  if (readOnly && !focus.length) {
    return (
      <span className="text-neutral-500 dark:text-neutral-400 self-center">
        -
      </span>
    );
  }

  const canOpen = !disabled;
  const showClear = !readOnly && focus.length > 0;

  return (
    <>
      <div
        ref={refEl}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Focus"
        onClick={() => canOpen && setOpen(o => !o)}
        className={`cursor-default input-wrapper flex items-center
          bg-white dark:bg-black shadow-xs rounded-2xl outline-2 pl-2 ${open ? 'shadow-md' : ''} ${
            error
              ? 'outline-red-500 dark:outline-red-400'
              : 'outline-transparent'
          } ${disabled ? 'field-busy' : ''}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          <ChipSummary focus={focus} />
        </div>

        {showClear ? (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              if (!disabled) onChange!([]);
            }}
            aria-label="Clear focus"
            className="p-2 cursor-pointer shrink-0 self-center hover:text-red-500 dark:hover:text-red-400"
          >
            <X size={16} />
          </button>
        ) : (
          <div className="p-2">
            <ChevronDown
              size={16}
              className={`shrink-0 self-center transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </div>
        )}
      </div>

      {open &&
        createPortal(
          <div
            ref={floatEl}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              maxHeight: pos.maxHeight,
            }}
            className="z-50 flex w-[min(90vw,32rem)] flex-col overflow-hidden rounded-2xl bg-white dark:bg-black shadow-lg outline-2 outline-neutral-100 dark:outline-neutral-800"
          >
            <div className="overflow-y-auto p-3 pr-2">
              {FOCUS_GROUPS.map(group => {
                const items = readOnly
                  ? group.items.filter(t => focus.includes(t))
                  : group.items;
                if (!items.length) return null;
                return (
                  <div key={group.label} className="mb-3 last:mb-0">
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                      {group.label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(tag => {
                        const selected = focus.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            disabled={readOnly}
                            onClick={() => toggle(tag)}
                            className={`font-medium text-sm px-2.5 py-1 rounded-full outline-1 transition-colors ${
                              readOnly ? 'cursor-default' : 'cursor-pointer'
                            } ${
                              selected
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 outline-transparent'
                                : 'bg-transparent text-neutral-500 dark:text-neutral-400 outline-neutral-200 dark:outline-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                            }`}
                          >
                            {FOCUS_LABELS[tag]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
