'use client';

import { FocusTrap } from 'focus-trap-react';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Group<T extends string> = { label: string; items: T[] };

type MultiSelectProps<T extends string> = {
  value: T[];
  onChange?: (next: T[]) => void;
  groups: Group<T>[];
  labels: Record<T, string>;
  chipsShown?: number;
  noun?: string;
  placeholder?: string;
  readEmptyLabel?: string;
  ariaLabel?: string;
  error?: boolean;
  disabled?: boolean;
};

function Chip({ label }: { label: string }) {
  return (
    <span className="shrink-0 inline-flex items-center font-medium text-sm px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200">
      {label}
    </span>
  );
}

export function MultiSelect<T extends string>({
  value,
  onChange,
  groups,
  labels,
  chipsShown = 3,
  noun = 'selected',
  placeholder = 'Click to add',
  readEmptyLabel = '-',
  ariaLabel,
  error,
  disabled,
}: MultiSelectProps<T>) {
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

  const toggle = (tag: T) => {
    if (readOnly || disabled) return;
    onChange!(
      value.includes(tag) ? value.filter(v => v !== tag) : [...value, tag]
    );
  };

  if (readOnly && !value.length) {
    return (
      <span className="text-neutral-500 dark:text-neutral-400 self-center">
        {readEmptyLabel}
      </span>
    );
  }

  const canOpen = !disabled;
  const showClear = !readOnly && value.length > 0;

  const renderSummary = () => {
    if (!value.length) {
      return (
        <span className="text-neutral-300 dark:text-neutral-600 pl-2">
          {placeholder}
        </span>
      );
    }
    if (chipsShown <= 0) {
      return <Chip label={`${value.length} ${noun}`} />;
    }
    if (value.length <= chipsShown) {
      return value.map(v => <Chip key={v} label={labels[v]} />);
    }
    const shown = value.slice(0, chipsShown - 1);
    const remaining = value.length - shown.length;
    return (
      <>
        {shown.map(v => (
          <Chip key={v} label={labels[v]} />
        ))}
        <Chip label={`+${remaining} more`} />
      </>
    );
  };

  const content = (
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
        {groups.map(group => {
          const items = readOnly
            ? group.items.filter(t => value.includes(t))
            : group.items;
          if (!items.length) return null;
          return (
            <div key={group.label} className="mb-3 last:mb-0">
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map(tag => {
                  const selected = value.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      role="option"
                      tabIndex={0}
                      aria-selected={selected}
                      disabled={readOnly}
                      onClick={() => toggle(tag)}
                      className={`font-medium text-sm px-2.5 py-1 rounded-full outline-2 transition-colors
                        focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400
                        ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
                          selected
                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 outline-transparent'
                            : 'bg-transparent text-neutral-500 dark:text-neutral-400 outline-neutral-200 dark:outline-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                        }`}
                    >
                      {labels[tag]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={refEl}
        role="button"
        tabIndex={canOpen ? 0 : -1}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onBlur={() => {
          if (readOnly) setOpen(false);
        }}
        onClick={() => {
          if (canOpen) {
            setOpen(o => !o);
          }
        }}
        onKeyDown={e => {
          if (!canOpen) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(o => !o);
          }
        }}
        className={`rounded-lg cursor-default input-wrapper flex items-center outline-2 pl-2 outline-transparent focus:outline-transparent focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400
          ${readOnly ? '' : `bg-white dark:bg-black focus-within:shadow-md rounded-2xl ${open ? 'shadow-md' : 'shadow-xs'}`}
          ${error ? 'outline-red-500 dark:outline-red-400' : 'outline-transparent'}
          ${disabled ? 'field-busy' : ''}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          {renderSummary()}
        </div>

        {showClear ? (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              if (!disabled) onChange!([]);
            }}
            aria-label="Clear"
            className="p-2 cursor-pointer shrink-0 w-[40px] h-[40px] flex justify-center items-center self-center hover:text-red-500 dark:hover:text-red-400 rounded-xl focus-visible:outline-2 focus-visible:outline-blue-500 dark:focus-visible:outline-blue-400"
          >
            <X aria-hidden size={14} />
          </button>
        ) : (
          <>
            {!readOnly && (
              <div className="p-2">
                <ChevronDown
                  size={16}
                  className={`shrink-0 self-center transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </div>
            )}
          </>
        )}
      </div>

      {open &&
        createPortal(
          readOnly ? (
            content
          ) : (
            <FocusTrap
              active={open}
              focusTrapOptions={{
                clickOutsideDeactivates: false,
                escapeDeactivates: false,
                returnFocusOnDeactivate: true,
              }}
            >
              {content}
            </FocusTrap>
          ),
          document.body
        )}
    </>
  );
}
