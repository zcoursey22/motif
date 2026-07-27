import { useRef, useState } from 'react';

type FocusInputProps = {
  focus: string[];
  onChange: (next: string[]) => void;
  error?: boolean;
};

const MAX_TAGS = 6;

export function FocusInput({ focus, onChange, error }: FocusInputProps) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const createTag = () => {
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
      className={`scrollbar-hide flex flex-nowrap items-center gap-1.5 overflow-x-auto bg-white dark:bg-neutral-900 shadow-sm rounded-2xl px-3 py-1.5 outline-2 cursor-text focus-within:shadow-lg ${
        error ? 'outline-red-500 dark:outline-red-400' : 'outline-transparent'
      }`}
      onClick={e => {
        (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus();
      }}
    >
      {focus.map(tag => (
        <button
          key={tag}
          type="button"
          className="shrink-0 inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-200 text-sm px-2 py-0.5 cursor-default rounded-full"
          onKeyDown={e => handleTagKeyDown(e, tag)}
          onClick={e => {
            e.stopPropagation();
            removeTag(tag);
          }}
          aria-label={`Remove "${tag}" tag`}
        >
          {tag}
        </button>
      ))}
      <input
        type="text"
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleInputKeyDown}
        className="shrink-0 flex-1 min-w-[60px] bg-transparent py-0.5 focus:outline-none placeholder-neutral-400"
      />
    </div>
  );
}
