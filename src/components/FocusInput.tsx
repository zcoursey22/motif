import { useRef, useState } from 'react';

type FocusInputProps = {
  focus: string[];
  onChange?: (next: string[]) => void;
  error?: boolean;
  disabled?: boolean; // busy-during-edit only; read mode = omit onChange
};

const MAX_TAGS = 6;

export function FocusInput({
  focus,
  onChange,
  error,
  disabled,
}: FocusInputProps) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!onChange) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {focus.map(tag => (
          <span
            key={tag}
            className="shrink-0 inline-flex items-center font-medium text-sm px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  const createTag = () => {
    if (disabled) return;
    const tag = draft.trim();
    if (tag && !focus.includes(tag) && focus.length < MAX_TAGS) {
      onChange([...focus, tag]);
    }
    setDraft('');
    requestAnimationFrame(() =>
      inputRef.current?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
    );
  };

  const removeTag = (tag: string) => {
    if (disabled) return;
    onChange(focus.filter(f => f !== tag));
    inputRef.current?.focus();
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    tag: string
  ) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      removeTag(tag);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      createTag();
    } else if (e.key === 'Backspace' && draft === '' && focus.length) {
      removeTag(focus[focus.length - 1]);
    }
  };

  return (
    <div
      className={`input-wrapper scrollbar-hide flex flex-nowrap px-4 items-center gap-1.5 overflow-x-auto bg-white dark:bg-black shadow-xs rounded-2xl px-3 py-1.5 outline-2 focus-within:shadow-md ${
        error ? 'outline-red-500 dark:outline-red-400' : 'outline-transparent'
      } ${disabled ? 'field-busy cursor-default' : 'cursor-text'}`}
      onClick={e => {
        if (disabled) return;
        (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus();
      }}
    >
      {focus.map(tag => (
        <button
          key={tag}
          type="button"
          className={`shrink-0 inline-flex items-center gap-1 font-medium text-sm px-2 py-0.5 cursor-default rounded-full
            bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200
            ${disabled ? '' : ' hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-200'}`}
          onKeyDown={e => handleTagKeyDown(e, tag)}
          onClick={e => {
            e.stopPropagation();
            removeTag(tag);
          }}
          aria-label={`Remove "${tag}" tag`}
          disabled={disabled}
        >
          {tag}
        </button>
      ))}
      <input
        type="text"
        ref={inputRef}
        value={draft}
        placeholder={focus.length ? undefined : 'Enter multiple...'}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => createTag()}
        onKeyDown={handleInputKeyDown}
        className="shrink-0 flex-1 min-w-[60px] bg-transparent py-0.5 focus:outline-none placeholder-neutral-300 dark:placeholder-neutral-600"
        aria-label="Focus"
      />
    </div>
  );
}
